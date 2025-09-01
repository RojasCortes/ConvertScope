export const API_BASE_URL = '/api';

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

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
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
  async getExchangeRates(): Promise<ExchangeRatesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/exchange-rates`);
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to get exchange rates:', error);
      
      // Fallback with mock data
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

  async getCurrencyHistory(base: string, target: string, period: string): Promise<HistoricalDataPoint[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/currency-history/${base}/${target}?period=${period}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Failed to get currency history for ${base}/${target}:`, error);
      return [];
    }
  },

  async saveConversion(conversion: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversion),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to save conversion:', error);
      return {
        id: Date.now().toString(),
        ...conversion,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      };
    }
  },

  async getRecentConversions(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversions/recent?limit=${limit}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to get recent conversions:', error);
      return [];
    }
  },

  async addFavorite(favorite: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorite),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to add favorite:', error);
      return {
        id: Date.now().toString(),
        ...favorite,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      };
    }
  },

  async getFavorites() {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`);
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  },

  async removeFavorite(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${id}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Failed to remove favorite ${id}:`, error);
      return { success: true, removedId: id.toString() };
    }
  },
};
