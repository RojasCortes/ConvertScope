// client/src/lib/api.ts - SIMPLIFICADO - SOLO FETCH
import { Capacitor } from '@capacitor/core';

// Detección de plataforma
const isNative = Capacitor.isNativePlatform();

// URL base
export const API_BASE_URL = isNative 
  ? 'https://convert-scope.vercel.app/api'
  : '/api';

console.log('🔍 API Configuration:');
console.log('- Platform:', Capacitor.getPlatform());
console.log('- IsNative:', isNative);
console.log('- API_BASE_URL:', API_BASE_URL);
console.log('- Using: FETCH ONLY (no CapacitorHttp)');

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

// ✅ FUNCIÓN SIMPLIFICADA - SOLO FETCH
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

  console.log(`🌐 Fetch Request:`, { method, url });
  
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
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || response.statusText);
    }

    return response.json();
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
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
          JPY: 110.0,
          CAD: 1.25,
          AUD: 1.35,
          CHF: 0.92,
          CNY: 6.45,
          MXN: 17.5,
          BRL: 5.2,
          COP: 4100.0
        },
        timestamp: Date.now(),
        fallback: true
      };
    }
  },

  // Obtener historial de divisas
  async getCurrencyHistory(base: string, target: string, period: string): Promise<HistoricalDataPoint[]> {
    try {
      const params = new URLSearchParams({
        base: base.toUpperCase(),
        target: target.toUpperCase(),
        period: period
      });
      
      const url = `${API_BASE_URL}/currency-history?${params.toString()}`;
      console.log(`📊 Fetching currency history: ${url}`);
      
      const response = await makeRequest<HistoricalDataResponse>(url);
      
      return response.data || [];
    } catch (error) {
      console.error(`Failed to get currency history for ${base}/${target}:`, error);
      return [];
    }
  },

  // Guardar conversión
  async saveConversion(conversion: Omit<Conversion, 'id' | 'createdAt' | 'timestamp'>): Promise<Conversion> {
    console.log('💾 Saving conversion:', conversion);
    return await makeRequest<Conversion>(`${API_BASE_URL}/conversions`, {
      method: 'POST',
      body: conversion
    });
  },

  // ✅ CONVERSIONES RECIENTES - RUTA CORRECTA
  async getRecentConversions(limit = 10): Promise<Conversion[]> {
    const url = `${API_BASE_URL}/conversions?limit=${limit}`;
    console.log(`📋 Fetching recent conversions: ${url}`);
    
    try {
      const result = await makeRequest<Conversion[]>(url);
      console.log(`Got ${Array.isArray(result) ? result.length : 0} recent conversions`);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Failed to get recent conversions:', error);
      return [];
    }
  },

  // Agregar favorito
  async addFavorite(favorite: Omit<Favorite, 'id' | 'createdAt' | 'timestamp'>): Promise<Favorite> {
    console.log('⭐ Adding favorite:', favorite);
    return await makeRequest<Favorite>(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      body: favorite
    });
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

  // ✅ ELIMINAR FAVORITO - RUTA CORRECTA
  async removeFavorite(id: number | string): Promise<{ success: boolean; removedId: string }> {
    console.log(`🗑️ Removing favorite with ID: ${id}`);
    
    const url = `${API_BASE_URL}/favorites?id=${id}`;
    
    return await makeRequest<{ success: boolean; removedId: string }>(url, {
      method: 'DELETE'
    });
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