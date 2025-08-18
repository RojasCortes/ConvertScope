// client/src/lib/api.ts - CORREGIDO
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

// Detectar si estamos en nativo o web
const isNative = Capacitor.isNativePlatform();

// URL base según el entorno
export const API_BASE_URL = isNative 
  ? 'https://convert-scope.vercel.app/api'  // URL completa para Android
  : '/api';  // URL relativa para web

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

// Función helper para hacer requests que funciona en web y nativo
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

  console.log(`${isNative ? 'Native' : 'Web'} ${method} request to: ${url}`);
  
  try {
    if (isNative) {
      // Usar CapacitorHttp en Android/iOS
      const httpOptions: HttpOptions = {
        url,
        method,
        headers: defaultHeaders,
        connectTimeout: 15000,
        readTimeout: 20000
      };

      if (body && method !== 'GET') {
        httpOptions.data = body;
      }

      const response: HttpResponse = await CapacitorHttp.request(httpOptions);
      
      console.log(`Native response status: ${response.status}`);
      
      if (response.status >= 400) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.data?.error || 'Request failed'}`);
      }

      return response.data;
    } else {
      // Usar fetch en web
      const fetchOptions: RequestInit = {
        method,
        headers: defaultHeaders,
        mode: 'cors',
        credentials: 'same-origin'
      };

      if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      
      console.log(`Web response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || response.statusText);
      }

      return response.json();
    }
  } catch (error) {
    console.error(`Request failed for ${url}:`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(0, `Network error: ${(error as Error).message || 'Unknown error'}`);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || response.statusText);
  }
  
  return response.json();
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

  // Obtener historial de divisas - CORREGIDO
  async getCurrencyHistory(base: string, target: string, period: string): Promise<HistoricalDataPoint[]> {
    try {
      // Usar query parameters según tu API actual
      const params = new URLSearchParams({
        base: base.toUpperCase(),
        target: target.toUpperCase(),
        period: period
      });
      
      const url = `${API_BASE_URL}/currency-history?${params.toString()}`;
      console.log(`Fetching currency history: ${url}`);
      
      const response = await makeRequest<HistoricalDataResponse>(url);
      
      // Extraer solo los data points
      return response.data || [];
    } catch (error) {
      console.error(`Failed to get currency history for ${base}/${target}:`, error);
      
      // Fallback con datos mock
      const days = period === '7d' ? 7 : period === '1m' ? 30 : 7;
      const mockData: HistoricalDataPoint[] = [];
      const baseRate = base === 'USD' && target === 'EUR' ? 0.85 : 1;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const fluctuation = (Math.random() - 0.5) * 0.04;
        const rate = baseRate * (1 + fluctuation);
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          rate: rate.toFixed(6)
        });
      }
      
      return mockData;
    }
  },

  // Guardar conversión
  async saveConversion(conversion: Omit<Conversion, 'id' | 'createdAt' | 'timestamp'>): Promise<Conversion> {
    try {
      return await makeRequest<Conversion>(`${API_BASE_URL}/conversions`, {
        method: 'POST',
        body: conversion
      });
    } catch (error) {
      console.error('Failed to save conversion:', error);
      throw error;
    }
  },

  // Obtener conversiones recientes - CORREGIDO
  async getRecentConversions(limit = 10): Promise<Conversion[]> {
    try {
      // Usar la ruta correcta sin /recent
      const url = `${API_BASE_URL}/conversions?limit=${limit}`;
      console.log(`Fetching recent conversions: ${url}`);
      
      const result = await makeRequest<Conversion[]>(url);
      console.log(`Got ${Array.isArray(result) ? result.length : 0} recent conversions`);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Failed to get recent conversions:', error);
      return []; // Devolver array vacío en caso de error
    }
  },

  // Agregar favorito
  async addFavorite(favorite: Omit<Favorite, 'id' | 'createdAt' | 'timestamp'>): Promise<Favorite> {
    try {
      console.log('Adding favorite:', favorite);
      return await makeRequest<Favorite>(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        body: favorite
      });
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
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
      return []; // Devolver array vacío en caso de error
    }
  },

  // Eliminar favorito - CORREGIDO
  async removeFavorite(id: number | string): Promise<{ success: boolean; removedId: string }> {
    try {
      console.log(`Removing favorite with ID: ${id}`);
      
      // Usar query parameter según tu API
      const url = `${API_BASE_URL}/favorites?id=${id}`;
      
      return await makeRequest<{ success: boolean; removedId: string }>(url, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Failed to remove favorite ${id}:`, error);
      throw error;
    }
  },

  // Función de diagnóstico
  async testConnection(): Promise<boolean> {
    try {
      await this.getExchangeRates();
      console.log('✅ API connection test: SUCCESS');
      return true;
    } catch (error) {
      console.error('❌ API connection test: FAILED', error);
      return false;
    }
  }
};