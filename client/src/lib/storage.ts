// Sistema híbrido de almacenamiento para Web y APK
// Funciona tanto online (con API) como offline (localStorage)

export interface StoredConversion {
  id: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  category: string;
  createdAt: string;
  timestamp: number;
}

export interface StoredFavorite {
  id: string;
  fromUnit: string;
  toUnit: string;
  category: string;
  name?: string;
  createdAt: string;
  timestamp: number;
}

// Claves para localStorage
const STORAGE_KEYS = {
  CONVERSIONS: 'convertscope_conversions',
  FAVORITES: 'convertscope_favorites',
  LAST_SYNC: 'convertscope_last_sync'
};

export class HybridStorage {
  private maxLocalItems = 50; // Máximo de items en localStorage
  
  // === CONVERSIONES ===
  
  async saveConversion(conversion: Omit<StoredConversion, 'id' | 'createdAt' | 'timestamp'>): Promise<StoredConversion> {
    const newConversion: StoredConversion = {
      id: Date.now().toString(),
      ...conversion,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Guardar en localStorage inmediatamente
    this.addToLocalStorage(STORAGE_KEYS.CONVERSIONS, newConversion);
    
    // Intentar sincronizar con servidor
    try {
      const response = await fetch('/api/conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversion)
      });
      
      if (response.ok) {
        const serverConversion = await response.json();
        console.log('Conversion saved to server:', serverConversion.id);
      }
    } catch (error) {
      console.log('Offline: Conversion saved locally only');
    }

    return newConversion;
  }

  async getRecentConversions(limit = 10): Promise<StoredConversion[]> {
    // Intentar obtener del servidor primero
    try {
      const response = await fetch(`/api/conversions/recent?limit=${limit}`);
      if (response.ok) {
        const serverConversions = await response.json();
        if (Array.isArray(serverConversions) && serverConversions.length > 0) {
          return serverConversions.map(this.formatConversion);
        }
      }
    } catch (error) {
      console.log('Using local conversions (offline)');
    }

    // Fallback a localStorage
    return this.getFromLocalStorage(STORAGE_KEYS.CONVERSIONS)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // === FAVORITOS ===

  async addFavorite(favorite: Omit<StoredFavorite, 'id' | 'createdAt' | 'timestamp'>): Promise<StoredFavorite> {
    const newFavorite: StoredFavorite = {
      id: Date.now().toString(),
      ...favorite,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Verificar duplicados localmente
    const existingFavorites = this.getFromLocalStorage(STORAGE_KEYS.FAVORITES);
    const isDuplicate = existingFavorites.some(fav => 
      fav.fromUnit === favorite.fromUnit && 
      fav.toUnit === favorite.toUnit && 
      fav.category === favorite.category
    );

    if (isDuplicate) {
      throw new Error('Favorite already exists');
    }

    // Guardar en localStorage
    this.addToLocalStorage(STORAGE_KEYS.FAVORITES, newFavorite);
    
    // Intentar sincronizar con servidor
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorite)
      });
      
      if (response.ok) {
        const serverFavorite = await response.json();
        console.log('Favorite saved to server:', serverFavorite.id);
      }
    } catch (error) {
      console.log('Offline: Favorite saved locally only');
    }

    return newFavorite;
  }

  async getFavorites(): Promise<StoredFavorite[]> {
    // Intentar obtener del servidor primero
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const serverFavorites = await response.json();
        if (Array.isArray(serverFavorites) && serverFavorites.length > 0) {
          return serverFavorites.map(this.formatFavorite);
        }
      }
    } catch (error) {
      console.log('Using local favorites (offline)');
    }

    // Fallback a localStorage
    return this.getFromLocalStorage(STORAGE_KEYS.FAVORITES)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async removeFavorite(id: string): Promise<boolean> {
    // Eliminar de localStorage
    const favorites = this.getFromLocalStorage(STORAGE_KEYS.FAVORITES);
    const filteredFavorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filteredFavorites));

    // Intentar eliminar del servidor
    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        console.log('Favorite removed from server:', id);
      }
    } catch (error) {
      console.log('Offline: Favorite removed locally only');
    }

    return true;
  }

  // === UTILIDADES PRIVADAS ===

  private addToLocalStorage(key: string, item: StoredConversion | StoredFavorite): void {
    try {
      const existing = this.getFromLocalStorage(key);
      existing.unshift(item);
      
      // Mantener solo los más recientes
      const trimmed = existing.slice(0, this.maxLocalItems);
      localStorage.setItem(key, JSON.stringify(trimmed));
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }

  private getFromLocalStorage(key: string): any[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return [];
    }
  }

  private formatConversion(serverConversion: any): StoredConversion {
    return {
      id: serverConversion.id?.toString() || Date.now().toString(),
      fromUnit: serverConversion.fromUnit || '',
      toUnit: serverConversion.toUnit || '',
      fromValue: parseFloat(serverConversion.fromValue) || 0,
      toValue: parseFloat(serverConversion.toValue) || 0,
      category: serverConversion.category || '',
      createdAt: serverConversion.createdAt || new Date().toISOString(),
      timestamp: new Date(serverConversion.createdAt || Date.now()).getTime()
    };
  }

  private formatFavorite(serverFavorite: any): StoredFavorite {
    return {
      id: serverFavorite.id?.toString() || Date.now().toString(),
      fromUnit: serverFavorite.fromUnit || '',
      toUnit: serverFavorite.toUnit || '',
      category: serverFavorite.category || '',
      name: serverFavorite.name,
      createdAt: serverFavorite.createdAt || new Date().toISOString(),
      timestamp: new Date(serverFavorite.createdAt || Date.now()).getTime()
    };
  }

  // === MÉTODOS DE SINCRONIZACIÓN ===

  async syncWithServer(): Promise<boolean> {
    try {
      // Verificar conectividad
      const response = await fetch('/api/exchange-rates');
      if (!response.ok) throw new Error('No connectivity');

      console.log('✅ Connected to server - data will sync automatically');
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      return true;
    } catch (error) {
      console.log('📱 Offline mode - using local storage');
      return false;
    }
  }

  getConnectionStatus(): { isOnline: boolean; lastSync: string | null } {
    return {
      isOnline: navigator.onLine,
      lastSync: localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
    };
  }

  // === MÉTODOS PARA CAPACITOR ===

  async clearAllData(): Promise<void> {
    // Limpiar localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('All local data cleared');
  }

  async exportData(): Promise<string> {
    const data = {
      conversions: this.getFromLocalStorage(STORAGE_KEYS.CONVERSIONS),
      favorites: this.getFromLocalStorage(STORAGE_KEYS.FAVORITES),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }
}

// Instancia singleton
export const hybridStorage = new HybridStorage();