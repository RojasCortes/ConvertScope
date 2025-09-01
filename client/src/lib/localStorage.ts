// Sistema de almacenamiento local simplificado para web y APK
// Solo usa localStorage en web y almacenamiento nativo en APK (Capacitor)

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

// Claves para almacenamiento
const STORAGE_KEYS = {
  CONVERSIONS: 'convertscope_conversions',
  FAVORITES: 'convertscope_favorites',
  SETTINGS: 'convertscope_settings'
};

export class LocalStorage {
  private maxItems = 50; // Máximo de items guardados
  
  // === CONVERSIONES ===
  
  async addConversion(conversion: Omit<StoredConversion, 'id' | 'createdAt' | 'timestamp'>): Promise<StoredConversion> {
    const newConversion: StoredConversion = {
      id: Date.now().toString(),
      ...conversion,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Guardar en almacenamiento local
    this.addToStorage(STORAGE_KEYS.CONVERSIONS, newConversion);
    console.log('💾 Conversion saved locally:', newConversion.id);
    
    return newConversion;
  }

  async getRecentConversions(limit = 10): Promise<StoredConversion[]> {
    const conversions = this.getFromStorage(STORAGE_KEYS.CONVERSIONS);
    return conversions
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

    // Verificar duplicados
    const existingFavorites = this.getFromStorage(STORAGE_KEYS.FAVORITES);
    const isDuplicate = existingFavorites.some(fav => 
      fav.fromUnit === favorite.fromUnit && 
      fav.toUnit === favorite.toUnit && 
      fav.category === favorite.category
    );

    if (isDuplicate) {
      throw new Error('Favorite already exists');
    }

    // Guardar en almacenamiento local
    this.addToStorage(STORAGE_KEYS.FAVORITES, newFavorite);
    console.log('⭐ Favorite saved locally:', newFavorite.id);
    
    return newFavorite;
  }

  async getFavorites(): Promise<StoredFavorite[]> {
    const favorites = this.getFromStorage(STORAGE_KEYS.FAVORITES);
    return favorites.sort((a, b) => b.timestamp - a.timestamp);
  }

  async removeFavorite(id: string): Promise<boolean> {
    const favorites = this.getFromStorage(STORAGE_KEYS.FAVORITES);
    const filteredFavorites = favorites.filter(fav => fav.id !== id);
    
    this.setStorage(STORAGE_KEYS.FAVORITES, filteredFavorites);
    console.log('🗑️ Favorite removed locally:', id);
    
    return true;
  }

  // === UTILIDADES PRIVADAS ===

  private addToStorage(key: string, item: StoredConversion | StoredFavorite): void {
    try {
      const existing = this.getFromStorage(key);
      existing.unshift(item);
      
      // Mantener solo los más recientes
      const trimmed = existing.slice(0, this.maxItems);
      this.setStorage(key, trimmed);
    } catch (error) {
      console.warn('Storage not available:', error);
    }
  }

  private getFromStorage(key: string): any[] {
    try {
      // En web usa localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
      }
      
      // En APK Capacitor podría usar Storage plugin aquí
      // Por ahora retorna array vacío si no hay localStorage
      return [];
    } catch (error) {
      console.warn('Error reading from storage:', error);
      return [];
    }
  }

  private setStorage(key: string, data: any[]): void {
    try {
      // En web usa localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(data));
      }
      
      // En APK Capacitor podría usar Storage plugin aquí
    } catch (error) {
      console.warn('Error writing to storage:', error);
    }
  }

  // === MÉTODOS DE GESTIÓN ===

  async clearAllData(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
      }
      console.log('🧹 All local data cleared');
    } catch (error) {
      console.warn('Error clearing storage:', error);
    }
  }

  async exportData(): Promise<string> {
    const data = {
      conversions: this.getFromStorage(STORAGE_KEYS.CONVERSIONS),
      favorites: this.getFromStorage(STORAGE_KEYS.FAVORITES),
      exportedAt: new Date().toISOString(),
      platform: typeof window !== 'undefined' ? 'web' : 'native'
    };
    
    return JSON.stringify(data, null, 2);
  }

  getStorageStatus(): { available: boolean; itemCount: number; lastUpdate: string | null } {
    try {
      const conversions = this.getFromStorage(STORAGE_KEYS.CONVERSIONS);
      const favorites = this.getFromStorage(STORAGE_KEYS.FAVORITES);
      
      return {
        available: typeof window !== 'undefined' && !!window.localStorage,
        itemCount: conversions.length + favorites.length,
        lastUpdate: conversions.length > 0 ? conversions[0].createdAt : null
      };
    } catch (error) {
      return {
        available: false,
        itemCount: 0,
        lastUpdate: null
      };
    }
  }
}

// Instancia singleton
export const localStorageManager = new LocalStorage();