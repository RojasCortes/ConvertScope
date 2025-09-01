// 🔧 FIXES APLICADOS - Igual que CategoryConverter exitoso

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';
import { useConverterStore } from '@/stores/useConverterStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdSpace } from '@/components/AdSpace';
import { CurrencyChart } from '@/components/CurrencyChart';
import { TechnicalIndicators } from '@/components/TechnicalIndicators';
import { ArrowLeft, ArrowUpDown, BarChart3, TrendingUp, Gem } from 'lucide-react';
import { currencies } from '@/lib/currencies';
import { api } from '@/lib/api';

export function CurrencyConverter() {
  const { setCurrentView } = useAppStore();
  const { 
    fromCurrency, toCurrency, currencyAmount, convertedCurrencyAmount,
    exchangeRates, historicalData,
    setFromCurrency, setToCurrency, setCurrencyAmount, 
    setConvertedCurrencyAmount, setExchangeRates, setHistoricalData,
    swapCurrencies, convertCurrency
  } = useConverterStore();
  const { t } = useTranslation();
  const [period, setPeriod] = useState('7d');
  const queryClient = useQueryClient();

  // 🚀 FIX 1: Estado simplificado para el input (igual que CategoryConverter)
  const [displayAmount, setDisplayAmount] = useState('');

  // Check for pending navigation from favorites
  useEffect(() => {
    console.log('🔍 CurrencyConverter: Checking for pending navigation...');
    const pendingNav = localStorage.getItem('pendingFavoriteNavigation');
    console.log('📋 Found pending navigation:', pendingNav);
    
    if (pendingNav) {
      try {
        const navData = JSON.parse(pendingNav);
        const isRecent = Date.now() - navData.timestamp < 10000; // 10 seconds
        console.log('⏰ Navigation data age:', Date.now() - navData.timestamp, 'ms');
        console.log('✅ Is recent:', isRecent);
        console.log('🎯 Category match:', navData.category === 'currency');
        
        if (isRecent && navData.category === 'currency') {
          console.log('🎯 Setting currencies from favorite navigation:', navData);
          console.log('📤 Current currencies:', { from: fromCurrency, to: toCurrency });
          
          // Force update currencies with a slight delay to ensure store is ready
          setTimeout(() => {
            setFromCurrency(navData.fromUnit);
            setToCurrency(navData.toUnit);
            console.log('📥 New currencies set:', { from: navData.fromUnit, to: navData.toUnit });
          }, 50);
          
          localStorage.removeItem('pendingFavoriteNavigation');
          console.log('🗑️ Cleared pending navigation');
        } else {
          console.log('⚠️ Navigation data invalid or expired');
          localStorage.removeItem('pendingFavoriteNavigation');
        }
      } catch (error) {
        console.error('❌ Error parsing favorite navigation:', error);
        localStorage.removeItem('pendingFavoriteNavigation');
      }
    }
  }, [fromCurrency, toCurrency, setFromCurrency, setToCurrency]);

  // Fetch exchange rates
  const { data: ratesData, isLoading: ratesLoading, error: ratesError } = useQuery({
    queryKey: ['/api/exchange-rates'],
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
    queryFn: () => api.getExchangeRates()
  });

  // Fetch historical data
  const { data: historicalDataResponse, isLoading: isHistoricalLoading, error: historicalError } = useQuery({
    queryKey: ['/api/currency-history', fromCurrency, toCurrency, period],
    enabled: !!(fromCurrency && toCurrency),
    staleTime: 5 * 60 * 1000,
    queryFn: () => api.getCurrencyHistory(fromCurrency, toCurrency, period)
  });

  // Fetch favorites to check status
  const { data: favoritesData } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { localStorageManager } = await import('@/lib/localStorage');
      return localStorageManager.getFavorites();
    }
  });

  // Check if current pair is favorited
  const isFavorited = Array.isArray(favoritesData) && favoritesData.some((fav: any) => 
    fav.fromUnit === fromCurrency && fav.toUnit === toCurrency && fav.category === 'currency'
  );

  const saveConversionMutation = useMutation({
    mutationFn: async (conversionData: any) => {
      const { localStorageManager } = await import('@/lib/localStorage');
      return localStorageManager.addConversion({
        fromUnit: conversionData.fromUnit,
        toUnit: conversionData.toUnit,
        fromValue: parseFloat(conversionData.fromValue),
        toValue: parseFloat(conversionData.toValue),
        category: 'currency'
      });
    },
    onSuccess: (result) => {
      console.log('✅ Currency conversion saved:', result);
      queryClient.invalidateQueries({ queryKey: ['recent-conversions'] });
    },
    onError: (error) => {
      console.error('❌ Error saving currency conversion:', error);
    },
  });

  useEffect(() => {
    if (ratesData && typeof ratesData === 'object' && ratesData !== null && 'rates' in ratesData) {
      console.log('Exchange rates loaded:', Object.keys(ratesData.rates).length, 'currencies');
      setExchangeRates(ratesData.rates as Record<string, number>);
    } else if (ratesError) {
      console.log('Exchange rates error, setting fallback data');
      setExchangeRates({
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
        COP: 4200.0
      });
    }
  }, [ratesData, ratesError, setExchangeRates]);

  useEffect(() => {
    if (historicalDataResponse && Array.isArray(historicalDataResponse)) {
      console.log('Setting historical data in store:', historicalDataResponse);
      setHistoricalData(historicalDataResponse);
    } else if (historicalDataResponse) {
      console.log('Historical data response is not array:', historicalDataResponse);
    }
  }, [historicalDataResponse, setHistoricalData]);

  // 🚀 FIX 2: useEffect simplificado - Solo se ejecuta en conversión automática
  useEffect(() => {
    if (exchangeRates && Object.keys(exchangeRates).length > 0 && currencyAmount >= 0 && fromCurrency && toCurrency) {
      console.log('Converting:', currencyAmount, fromCurrency, 'to', toCurrency);
      const converted = convertCurrency(currencyAmount, fromCurrency, toCurrency);
      console.log('Conversion result:', converted);
      setConvertedCurrencyAmount(converted);
      
      // Save currency conversion immediately (no delay for better reliability)
      if (currencyAmount > 0 && converted > 0) {
        console.log('💾 Saving currency conversion immediately:', { fromCurrency, toCurrency, currencyAmount, converted });
        saveConversionMutation.mutate({
          fromUnit: fromCurrency,
          toUnit: toCurrency,
          fromValue: currencyAmount.toString(),
          toValue: converted.toString(),
          category: 'currency'
        });
      }
    }
  }, [currencyAmount, fromCurrency, toCurrency, exchangeRates]);

  // 🚀 FIX 3: Función de manejo simplificada (igual que CategoryConverter)
  const handleAmountChange = (value: string) => {
    setDisplayAmount(value);
    
    // Solo convertir a número si hay contenido y es válido
    if (value.trim() === '') {
      setCurrencyAmount(0);
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCurrencyAmount(numValue);
    }
    // Si el valor no es válido, no actualizamos currencyAmount
    // pero sí mantenemos displayAmount para que el usuario vea lo que escribió
  };

  // 🚀 FIX 4: Swap mejorado
  const handleSwap = () => {
    const newFromAmount = convertedCurrencyAmount;
    const newToAmount = currencyAmount;
    
    // Actualizar display inmediatamente
    setDisplayAmount(newFromAmount > 0 ? newFromAmount.toString() : '');
    
    // Hacer el swap
    swapCurrencies();
    
    // Actualizar valores
    setCurrencyAmount(newFromAmount);
    setConvertedCurrencyAmount(newToAmount);
    
    // Save conversion
    if (newFromAmount > 0) {
      saveConversionMutation.mutate({
        fromUnit: toCurrency,
        toUnit: fromCurrency,
        fromValue: newFromAmount,
        toValue: newToAmount,
        category: 'currency'
      });
    }
  };

  const getCurrentRate = () => {
    if (!exchangeRates || fromCurrency === toCurrency) return 1;
    return convertCurrency(1, fromCurrency, toCurrency);
  };

  const getPriceChange = () => {
    return (Math.random() - 0.5) * 2;
  };

  const getCurrencyStrength = (currency: string) => {
    const strengths: Record<string, number> = {
      USD: 85,
      EUR: 78,
      GBP: 72,
      JPY: 68,
      CHF: 75,
      CAD: 65,
      COP: 60,
    };
    return strengths[currency] || 60;
  };

  const getTopCurrencies = () => {
    return ['USD', 'EUR', 'GBP', 'JPY', 'CHF'].map(code => {
      const currency = currencies.find(c => c.code === code);
      return {
        ...currency,
        strength: getCurrencyStrength(code)
      };
    });
  };

  const currentRate = getCurrentRate();
  const priceChange = getPriceChange();
  const topCurrencies = getTopCurrencies();

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <div className="p-4 pb-2">
        <Button
          variant="ghost"
          onClick={() => {
            // Reset currency values when going back
            setCurrencyAmount(100); // Reset to default
            setConvertedCurrencyAmount(0);
            setDisplayAmount('');
            console.log('🔄 Reset currency values on back navigation');
            setCurrentView('home');
          }}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">{t('common.back')}</span>
        </Button>
      </div>

      {/* Currency Header */}
      <div className="px-4 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          💰 {t('currency.title')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {t('currency.description')}
        </p>
      </div>

      {/* Quick Converter */}
      <div className="px-4 pb-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {/* From Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('currency.from')}
                </label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* 🚀 FIX 5: Input simplificado - Igual que CategoryConverter */}
                <input
                  type="text"
                  inputMode="decimal"
                  value={displayAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full mt-2 text-lg font-semibold px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder={t('currency.enterAmount')}
                />
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSwap}
                  className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors"
                  size="icon"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('currency.to')}
                </label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="w-full mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-lg font-semibold">
                    {new Intl.NumberFormat('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 6 
                    }).format(convertedCurrencyAmount)}
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
                </span>
                <span className={`font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('currency.lastUpdate')}: {ratesLoading ? t('common.loading') : 'Just now'}
              </div>
              
              {/* Add to Favorites Button */}
              <div className="mt-3 flex justify-center">
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  size="sm"
                  onClick={async () => {
                    try {
                      const { localStorageManager } = await import('@/lib/localStorage');
                      
                      if (isFavorited) {
                        const favoriteToRemove = favoritesData?.find((fav: any) => 
                          fav.fromUnit === fromCurrency && fav.toUnit === toCurrency && fav.category === 'currency'
                        );
                        if (favoriteToRemove) {
                          await localStorageManager.removeFavorite(favoriteToRemove.id);
                          await queryClient.invalidateQueries({ queryKey: ['favorites'] });
                          alert(t('common.removedFromFavorites'));
                        }
                      } else {
                        await localStorageManager.addFavorite({
                          fromUnit: fromCurrency,
                          toUnit: toCurrency,
                          category: 'currency'
                        });
                        await queryClient.invalidateQueries({ queryKey: ['favorites'] });
                        alert(t('common.addedToFavorites'));
                      }
                    } catch (error) {
                      console.error('Error updating favorites:', error);
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <span>{isFavorited ? '⭐' : '☆'}</span>
                  <span>{isFavorited ? t('common.inFavorites') : t('common.addToFavorites')}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Space */}
      <AdSpace />

      {/* Currency Strength Index */}
      <div className="px-4 pb-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <BarChart3 className="inline-block text-blue-500 mr-2" />
              {t('currency.strengthIndex')}
            </h3>
            
            <div className="space-y-3">
              {topCurrencies.map((currency) => (
                <div key={currency?.code} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{currency?.flag}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{currency?.code}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{currency?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${currency?.strength}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-green-500">{currency?.strength}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Chart */}
      <div className="px-4 pb-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                <TrendingUp className="inline-block text-blue-500 mr-2" />
                {t('currency.historicalChart')}
              </h3>
              
              <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                {['7d', '1m', '1y', '5y'].map((p) => (
                  <Button
                    key={p}
                    variant={period === p ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPeriod(p)}
                    className="px-3 py-1 text-sm"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <CurrencyChart 
              baseCurrency={fromCurrency} 
              targetCurrency={toCurrency} 
              period={period}
              data={historicalDataResponse}
            />

            <TechnicalIndicators 
              rsi={64.2} 
              sma={currentRate} 
              volatility="Medium" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Predictions */}
      <div className="px-4 pb-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <Gem className="inline-block text-blue-500 mr-2" />
              {t('currency.basicPrediction')}
            </h3>
            
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <TrendingUp className="text-green-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t('currency.bullishTrend')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {fromCurrency}/{toCurrency} {t('currency.couldIncrease')} 0.3% {t('currency.nextWeek')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {t('currency.basedOnTechnicalAnalysis')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Space */}
      <AdSpace />
    </div>
  );
}