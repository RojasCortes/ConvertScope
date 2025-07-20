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
import { apiRequest } from '@/lib/queryClient';

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

  // Fetch exchange rates
  const { data: ratesData, isLoading: ratesLoading } = useQuery({
    queryKey: ['/api/exchange-rates'],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Fetch historical data
  const { data: historicalDataResponse, isLoading: isHistoricalLoading, error: historicalError } = useQuery({
    queryKey: ['/api/currency-history', fromCurrency, toCurrency, period],
    enabled: !!(fromCurrency && toCurrency),
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const response = await fetch(`/api/currency-history/${fromCurrency}/${toCurrency}/${period}`);
      if (!response.ok) throw new Error('Failed to fetch historical data');
      const data = await response.json();
      console.log('Fetched historical data for chart:', data);
      return data;
    }
  });

  // Fetch favorites to check status
  const { data: favoritesData } = useQuery({
    queryKey: ['/api/favorites'],
  });

  // Check if current pair is favorited
  const isFavorited = Array.isArray(favoritesData) && favoritesData.some((fav: any) => 
    fav.fromUnit === fromCurrency && fav.toUnit === toCurrency && fav.category === 'currency'
  );





  const saveConversionMutation = useMutation({
    mutationFn: async (conversionData: any) => {
      return apiRequest('POST', '/api/conversions', conversionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversions/recent'] });
    },
  });

  useEffect(() => {
    if (ratesData && typeof ratesData === 'object' && ratesData !== null && 'rates' in ratesData) {
      setExchangeRates(ratesData.rates as Record<string, number>);
    }
  }, [ratesData, setExchangeRates]);

  useEffect(() => {
    if (historicalDataResponse && Array.isArray(historicalDataResponse)) {
      console.log('Setting historical data in store:', historicalDataResponse);
      setHistoricalData(historicalDataResponse);
    } else if (historicalDataResponse) {
      console.log('Historical data response is not array:', historicalDataResponse);
    }
  }, [historicalDataResponse, setHistoricalData]);

  useEffect(() => {
    if (exchangeRates && currencyAmount && fromCurrency && toCurrency) {
      const converted = convertCurrency(currencyAmount, fromCurrency, toCurrency);
      setConvertedCurrencyAmount(converted);
    }
  }, [currencyAmount, fromCurrency, toCurrency, exchangeRates, convertCurrency, setConvertedCurrencyAmount]);

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setCurrencyAmount(amount);
  };

  const handleSwap = () => {
    swapCurrencies();
    // Save conversion
    saveConversionMutation.mutate({
      fromUnit: toCurrency,
      toUnit: fromCurrency,
      fromValue: convertedCurrencyAmount.toString(),
      toValue: currencyAmount.toString(),
      category: 'currency'
    });
  };

  const getCurrentRate = () => {
    if (!exchangeRates || fromCurrency === toCurrency) return 1;
    return convertCurrency(1, fromCurrency, toCurrency);
  };

  const getPriceChange = () => {
    // Mock price change calculation
    return (Math.random() - 0.5) * 2; // Random between -1 and 1
  };

  const getCurrencyStrength = (currency: string) => {
    // Mock currency strength calculation
    const strengths: Record<string, number> = {
      USD: 85,
      EUR: 78,
      GBP: 72,
      JPY: 68,
      CHF: 75,
      CAD: 65,
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
          onClick={() => setCurrentView('home')}
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
                <Input
                  type="number"
                  value={currencyAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full mt-2 text-lg font-semibold"
                  placeholder="0.00"
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
                  {convertedCurrencyAmount.toFixed(2)}
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
                {t('currency.lastUpdate')}: {ratesLoading ? t('common.loading') : t('currency.timeAgo')}
              </div>
              
              {/* Add to Favorites Button */}
              <div className="mt-3 flex justify-center">
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  size="sm"
                  onClick={async () => {
                    try {
                      if (isFavorited) {
                        // Remove from favorites
                        const favoriteToRemove = favoritesData?.find((fav: any) => 
                          fav.fromUnit === fromCurrency && fav.toUnit === toCurrency && fav.category === 'currency'
                        );
                        if (favoriteToRemove) {
                          await fetch(`/api/favorites/${favoriteToRemove.id}`, {
                            method: 'DELETE',
                          });
                          await queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
                          alert('Removido de favoritos');
                        }
                      } else {
                        // Add to favorites
                        const response = await fetch('/api/favorites', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            fromUnit: fromCurrency,
                            toUnit: toCurrency,
                            category: 'currency'
                          }),
                        });
                        
                        if (response.ok) {
                          await queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
                          alert('Agregado a favoritos');
                        } else if (response.status === 409) {
                          alert('Ya está en favoritos');
                        }
                      }
                    } catch (error) {
                      console.error('Error updating favorites:', error);
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <span>{isFavorited ? '⭐' : '☆'}</span>
                  <span>{isFavorited ? 'En Favoritos' : 'Agregar a Favoritos'}</span>
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
