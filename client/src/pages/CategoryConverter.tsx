import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';
import { useConverterStore } from '@/stores/useConverterStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdSpace } from '@/components/AdSpace';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';
import { categories, getUnitsForCategory, convertValue } from '@/lib/conversions';
import { apiRequest } from '@/lib/queryClient';

export function CategoryConverter() {
  const { currentCategory, setCurrentView } = useAppStore();
  const { 
    fromUnit, toUnit, fromValue, toValue,
    setFromUnit, setToUnit, setFromValue, setToValue, swapUnits
  } = useConverterStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // ✨ SOLUCIÓN: Estado completamente independiente para el input
  const [displayValue, setDisplayValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [quickReferenceData, setQuickReferenceData] = useState<any[]>([]);

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
    fav.fromUnit === fromUnit && fav.toUnit === toUnit && fav.category === currentCategory
  );

  const category = categories.find(c => c.id === currentCategory);
  const units = getUnitsForCategory(currentCategory);

  // Save conversion mutation
  const saveConversionMutation = useMutation({
    mutationFn: async (conversionData: any) => {
      const { localStorageManager } = await import('@/lib/localStorage');
      return localStorageManager.addConversion({
        fromUnit: conversionData.fromUnit,
        toUnit: conversionData.toUnit,
        fromValue: parseFloat(conversionData.fromValue),
        toValue: parseFloat(conversionData.toValue),
        category: conversionData.category
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-conversions'] });
    },
  });

  useEffect(() => {
    if (units.length > 0 && !fromUnit) {
      setFromUnit(units[0].id);
      setToUnit(units[1]?.id || units[0].id);
    }
  }, [units, fromUnit, setFromUnit, setToUnit]);

  // ✨ NUEVO: Solo actualizar displayValue cuando NO esté enfocado
  useEffect(() => {
    if (!isInputFocused) {
      setDisplayValue(fromValue > 0 ? fromValue.toString() : '');
    }
  }, [fromValue, isInputFocused]);

  useEffect(() => {
    if (fromUnit && toUnit && fromValue > 0) {
      const converted = convertValue(fromValue, fromUnit, toUnit, currentCategory);
      setToValue(converted);
    } else {
      setToValue(0);
    }
  }, [fromValue, fromUnit, toUnit, currentCategory, setToValue]);

  useEffect(() => {
    // Generate quick reference table
    if (units.length >= 2) {
      const baseValues = [1, 5, 10, 50, 100];
      const refData = baseValues.map(val => {
        const conversions: Record<string, number> = {};
        units.slice(0, 3).forEach(unit => {
          conversions[unit.id] = convertValue(val, units[0].id, unit.id, currentCategory);
        });
        return { baseValue: val, ...conversions };
      });
      setQuickReferenceData(refData);
    }
  }, [units, currentCategory]);

  // ✨ NUEVO: Manejo definitivo del input
  const handleInputChange = (value: string) => {
    setDisplayValue(value);
    
    if (value === '' || value === '.') {
      setFromValue(0);
      return;
    }

    // Limpiar caracteres no válidos
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos
    if ((cleanValue.match(/\./g) || []).length > 1) {
      return;
    }

    const numValue = parseFloat(cleanValue);
    if (!isNaN(numValue) && numValue >= 0) {
      setFromValue(numValue);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    // Si el campo muestra 0, limpiarlo cuando se enfoque
    if (displayValue === '0') {
      setDisplayValue('');
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    // Si el campo está vacío al salir del foco, mostrar el valor actual
    if (displayValue === '') {
      setDisplayValue(fromValue > 0 ? fromValue.toString() : '');
    }
  };

  const handleSwap = () => {
    // Actualizar displayValue inmediatamente
    setDisplayValue(toValue > 0 ? toValue.toString() : '');
    swapUnits();
    
    // Save conversion
    saveConversionMutation.mutate({
      fromUnit: toUnit,
      toUnit: fromUnit,
      fromValue: toValue.toString(),
      toValue: fromValue.toString(),
      category: currentCategory
    });
  };

  const getConversionFormula = () => {
    if (!fromUnit || !toUnit || !units.length) return '';
    
    const fromUnitObj = units.find(u => u.id === fromUnit);
    const toUnitObj = units.find(u => u.id === toUnit);
    
    if (!fromUnitObj || !toUnitObj) return '';
    
    const conversionRate = convertValue(1, fromUnit, toUnit, currentCategory);
    return `1 ${fromUnitObj.name} = ${conversionRate} ${toUnitObj.name}`;
  };

  if (!category) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500 dark:text-gray-400">
          {t('common.categoryNotFound')}
        </p>
      </div>
    );
  }

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

      {/* Category Header */}
      <div className="px-4 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {category.emoji} {t(`categories.${currentCategory}.name`)}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {t(`categories.${currentCategory}.fullDescription`)}
        </p>
      </div>

      {/* Simple Converter */}
      <div className="px-4 pb-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {/* From Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('converter.from')}
                </label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* ✨ INPUT HTML NATIVO - SIN SHADCN */}
                <input
                  type="text"
                  inputMode="decimal"
                  value={displayValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full mt-2 text-lg font-semibold px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ingresa un valor"
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

              {/* To Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('converter.to')}
                </label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="w-full mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-lg font-semibold">
                  {toValue.toFixed(6)}
                </div>
              </div>
            </div>

            {/* Conversion Formula */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="font-medium">{t('converter.formula')}:</span> {getConversionFormula()}
              </p>
              
              {/* Add to Favorites Button */}
              <div className="flex justify-center">
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  size="sm"
                  onClick={async () => {
                    try {
                      if (isFavorited) {
                        // Remove from favorites
                        const favoriteToRemove = favoritesData?.find((fav: any) => 
                          fav.fromUnit === fromUnit && fav.toUnit === toUnit && fav.category === currentCategory
                        );
                        if (favoriteToRemove) {
                          const { localStorageManager } = await import('@/lib/localStorage');
                          await localStorageManager.removeFavorite(favoriteToRemove.id);
                          await queryClient.invalidateQueries({ queryKey: ['favorites'] });
                          alert(t('common.removedFromFavorites', 'Removed from favorites'));
                        }
                      } else {
                        // Add to favorites using localStorage
                        const { localStorageManager } = await import('@/lib/localStorage');
                        try {
                          await localStorageManager.addFavorite({
                            fromUnit: fromUnit,
                            toUnit: toUnit,
                            category: currentCategory
                          });
                          await queryClient.invalidateQueries({ queryKey: ['favorites'] });
                          alert(t('common.addedToFavorites', 'Added to favorites'));
                        } catch (error: any) {
                          if (error.message === 'Favorite already exists') {
                            alert(t('common.alreadyInFavorites', 'Already in favorites'));
                          } else {
                            throw error;
                          }
                        }
                      }
                    } catch (error) {
                      console.error('Error updating favorites:', error);
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <span>{isFavorited ? '⭐' : '☆'}</span>
                  <span>{isFavorited ? t('common.inFavorites', 'In Favorites') : t('common.addToFavorites', 'Add to Favorites')}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reference Table */}
      <div className="px-4 pb-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('converter.quickReference')}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {units.slice(0, 3).map((unit) => (
                      <th key={unit.id} className="text-left py-2 text-gray-900 dark:text-white">
                        {unit.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-400">
                  {quickReferenceData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                      {units.slice(0, 3).map((unit) => (
                        <td key={unit.id} className="py-2">
                          {row[unit.id]?.toFixed(2)} {unit.symbol}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Space */}
      <AdSpace />
    </div>
  );
}