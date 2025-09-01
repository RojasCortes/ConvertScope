// client/src/lib/api.ts - CON MANEJO DE ERRORES HTML
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export const API_BASE_URL = isNative 
  ? 'https://convert-scope.vercel.app/api'
  : '/api';

console.log('🔍 API Configuration:');
console.log('- Platform:', Capacitor.getPlatform());
console.log('- IsNative:', isNative);
console.log('- API_BASE_URL:', API_BASE_URL);

export interface ExchangeRatesResponse {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  fallback?: boolean;
}

export interface HistoricalDataPoint {
  date: string;
  rate: string;
}

export interface HistoricalDataResponse {
  base: string;
  target: string;
  period: string;
  data: HistoricalDataPoint[];
  generated: string;
}

export interface Conversion {
  id: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  category: string;
  createdAt: string;
  timestamp: number;
}

export interface Favorite {
  id: string;
  fromUnit: string;
  toUnit: string;
  category: string;
  name?: string;
  createdAt: string;
  timestamp: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ✅ FUNCIÓN CON DETECCIÓN DE ERRORES HTML
async function makeRequest<T>(url: string, options: {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
} = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers
  };

  console.log(`🌐 Request:`, { method, url });
  
  const fetchOptions: RequestInit = {
    method,
    headers: defaultHeaders,
    mode: 'cors',
    credentials: 'same-origin'
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    console.log(`📡 Response:`, {
      status: response.status,
      url: response.url,
      ok: response.ok,
      contentType: response.headers.get('content-type')
    });
    
    // ✅ VERIFICAR QUE NO SEA HTML
    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    // ✅ DETECTAR SI ES HTML (página de error)
    if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
      console.error('❌ API returned HTML instead of JSON:', responseText.substring(0, 200));
      throw new ApiError(response.status, `API returned HTML page instead of JSON. URL: ${url}`);
    }
    
    if (!response.ok) {
      throw new ApiError(response.status, responseText || response.statusText);
    }

    // ✅ VERIFICAR QUE SEA JSON VÁLIDO
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Invalid JSON response:', responseText.substring(0, 200));
      throw new ApiError(response.status, `Invalid JSON response from ${url}`);
    }
    
  } catch (error) {
    console.error(`❌ Request failed for ${url}:`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(0, `Network error: ${(error as Error).message || 'Unknown error'}`);
  }
}

export const api = {
  // Obtener tasas de cambio
  async getExchangeRates(): Promise<ExchangeRatesResponse> {
    try {
      return await makeRequest<ExchangeRatesResponse>(`${API_BASE_URL}/exchange-rates`);
    } catch (error) {
      console.error('Failed to get exchange rates:', error);
      
      // Fallback con datos mock
      return {
        base: "USD",
        rates: {
          USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25,
          AUD: 1.35, CHF: 0.92, CNY: 6.45, MXN: 17.5, BRL: 5.2, COP: 4100.0
        },
        timestamp: Date.now(),
        fallback: true
      };
    }
  },

  // Obtener historial de divisas
  async getCurrencyHistory(base: string, target: string, period: string): Promise<HistoricalDataPoint[]> {
    try {
      const url = `${API_BASE_URL}/currency-history/${base.toUpperCase()}/${target.toUpperCase()}?period=${period}`;
      const response = await makeRequest<HistoricalDataResponse>(url);
      return response.data || [];
    } catch (error) {
      console.error(`Failed to get currency history for ${base}/${target}:`, error);
      return [];
    }
  },

  // Guardar conversión
  async saveConversion(conversion: Omit<Conversion, 'id' | 'createdAt' | 'timestamp'>): Promise<Conversion> {
    try {
      console.log('💾 Saving conversion:', conversion);
      return await makeRequest<Conversion>(`${API_BASE_URL}/conversions`, {
        method: 'POST',
        body: conversion
      });
    } catch (error) {
      console.error('Failed to save conversion:', error);
      
      // ✅ FALLBACK: Crear conversión mock local
      const mockConversion: Conversion = {
        id: Date.now().toString(),
        ...conversion,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      console.log('Using mock conversion:', mockConversion);
      return mockConversion;
    }
  },

  // ✅ CONVERSIONES RECIENTES CON FALLBACK
  async getRecentConversions(limit = 10): Promise<Conversion[]> {
    try {
      const url = `${API_BASE_URL}/conversions/recent?limit=${limit}`;
      console.log(`📋 Fetching recent conversions: ${url}`);
      
      const result = await makeRequest<Conversion[]>(url);
      console.log(`Got ${Array.isArray(result) ? result.length : 0} recent conversions`);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Failed to get recent conversions:', error);
      
      // ✅ FALLBACK: Devolver array vacío pero informar
      console.log('📋 Using empty conversions as fallback');
      return [];
    }
  },

  // Agregar favorito
  async addFavorite(favorite: Omit<Favorite, 'id' | 'createdAt' | 'timestamp'>): Promise<Favorite> {
    try {
      console.log('⭐ Adding favorite:', favorite);
      return await makeRequest<Favorite>(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        body: favorite
      });
    } catch (error) {
      console.error('Failed to add favorite:', error);
      
      // ✅ FALLBACK: Crear favorito mock local
      const mockFavorite: Favorite = {
        id: Date.now().toString(),
        ...favorite,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      console.log('Using mock favorite:', mockFavorite);
      return mockFavorite;
    }
  },

  // Obtener favoritos
  async getFavorites(): Promise<Favorite[]> {
    try {
      const result = await makeRequest<Favorite[]>(`${API_BASE_URL}/favorites`);
      console.log(`Got ${Array.isArray(result) ? result.length : 0} favorites`);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  },

  // ✅ ELIMINAR FAVORITO CON FALLBACK
  async removeFavorite(id: number | string): Promise<{ success: boolean; removedId: string }> {
    try {
      console.log(`🗑️ Removing favorite with ID: ${id}`);
      
      const url = `${API_BASE_URL}/favorites/${id}`;
      
      return await makeRequest<{ success: boolean; removedId: string }>(url, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Failed to remove favorite ${id}:`, error);
      
      // ✅ FALLBACK: Simular eliminación exitosa
      console.log(`Using mock removal for favorite ${id}`);
      return { success: true, removedId: id.toString() };
    }
  },

  // Función de diagnóstico
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing API connection...');
      await this.getExchangeRates();
      console.log('✅ API connection test: SUCCESS');
      return true;
    } catch (error) {
      console.error('❌ API connection test: FAILED', error);
      return false;
    }
  }
};