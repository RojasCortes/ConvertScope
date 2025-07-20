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
    const response = await fetch(`${API_BASE_URL}/exchange-rates`);
    return handleResponse(response);
  },

  async getCurrencyHistory(base: string, target: string, period: string): Promise<HistoricalDataPoint[]> {
    const response = await fetch(`${API_BASE_URL}/currency-history/${base}/${target}?period=${period}`);
    return handleResponse(response);
  },

  async saveConversion(conversion: any) {
    const response = await fetch(`${API_BASE_URL}/conversions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversion),
    });
    return handleResponse(response);
  },

  async getRecentConversions(limit = 10) {
    const response = await fetch(`${API_BASE_URL}/conversions/recent?limit=${limit}`);
    return handleResponse(response);
  },

  async addFavorite(favorite: any) {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(favorite),
    });
    return handleResponse(response);
  },

  async getFavorites() {
    const response = await fetch(`${API_BASE_URL}/favorites`);
    return handleResponse(response);
  },

  async removeFavorite(id: number) {
    const response = await fetch(`${API_BASE_URL}/favorites/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
