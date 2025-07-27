import { create } from 'zustand';

interface CurrencyData {
  code: string;
  name: string;
  flag: string;
  rate: number;
}

interface ConversionResult {
  fromValue: number;
  toValue: number;
  fromUnit: string;
  toUnit: string;
  rate: number;
  category: string;
}

interface ConverterState {
  // Currency specific
  currencies: CurrencyData[];
  fromCurrency: string;
  toCurrency: string;
  currencyAmount: number;
  convertedCurrencyAmount: number;
  exchangeRates: Record<string, number>;
  historicalData: any[];
  
  // General conversion
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrencies: (currencies: CurrencyData[]) => void;
  setFromCurrency: (currency: string) => void;
  setToCurrency: (currency: string) => void;
  setCurrencyAmount: (amount: number) => void;
  setConvertedCurrencyAmount: (amount: number) => void;
  setExchangeRates: (rates: Record<string, number>) => void;
  setHistoricalData: (data: any[]) => void;
  
  setFromUnit: (unit: string) => void;
  setToUnit: (unit: string) => void;
  setFromValue: (value: number) => void;
  setToValue: (value: number) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  swapCurrencies: () => void;
  swapUnits: () => void;
  
  convertCurrency: (amount: number, from: string, to: string) => number;
}

export const useConverterStore = create<ConverterState>((set, get) => ({
  // Initial state
  currencies: [],
  fromCurrency: 'USD',
  toCurrency: 'EUR',
  currencyAmount: 100,
  convertedCurrencyAmount: 0,
  exchangeRates: {},
  historicalData: [],
  
  fromUnit: '',
  toUnit: '',
  fromValue: 1,
  toValue: 0,
  
  isLoading: false,
  error: null,
  
  // Actions
  setCurrencies: (currencies) => set({ currencies }),
  setFromCurrency: (fromCurrency) => set({ fromCurrency }),
  setToCurrency: (toCurrency) => set({ toCurrency }),
  setCurrencyAmount: (currencyAmount) => set({ currencyAmount }),
  setConvertedCurrencyAmount: (convertedCurrencyAmount) => set({ convertedCurrencyAmount }),
  setExchangeRates: (exchangeRates) => set({ exchangeRates }),
  setHistoricalData: (historicalData) => set({ historicalData }),
  
  setFromUnit: (fromUnit) => set({ fromUnit }),
  setToUnit: (toUnit) => set({ toUnit }),
  setFromValue: (fromValue) => set({ fromValue }),
  setToValue: (toValue) => set({ toValue }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  swapCurrencies: () => {
    const state = get();
    set({
      fromCurrency: state.toCurrency,
      toCurrency: state.fromCurrency,
      currencyAmount: state.convertedCurrencyAmount,
      convertedCurrencyAmount: state.currencyAmount,
    });
  },
  
  swapUnits: () => {
    const state = get();
    set({
      fromUnit: state.toUnit,
      toUnit: state.fromUnit,
      fromValue: state.toValue,
      toValue: state.fromValue,
    });
  },
  
  convertCurrency: (amount, from, to) => {
    const state = get();
    const { exchangeRates } = state;
    
    if (from === to) return amount;
    
    // Convert to USD first if not USD
    let usdAmount = amount;
    if (from !== 'USD') {
      const fromRate = exchangeRates[from];
      if (!fromRate) return 0;
      usdAmount = amount / fromRate;
    }
    
    // Convert from USD to target currency
    if (to === 'USD') {
      return usdAmount;
    }
    
    const toRate = exchangeRates[to];
    if (!toRate) return 0;
    
    return usdAmount * toRate;
  },
}));
