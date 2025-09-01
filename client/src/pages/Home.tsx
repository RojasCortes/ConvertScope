// client/src/pages/Home.tsx - CORREGIDO
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AdSpace } from '@/components/AdSpace';
import { Search, TrendingUp } from 'lucide-react';
import { useLocalizedCategories } from '@/lib/dynamicUnits';
import { api, type Conversion } from '@/lib/api'; // ¡USAR TU API con tipos!

export function Home() {
  const { setCurrentView, setCurrentCategory } = useAppStore();
  const categories = useLocalizedCategories();
  const { t } = useTranslation();

  // Usar almacenamiento local para conversiones recientes
  const { data: recentConversions = [], isLoading, error } = useQuery({
    queryKey: ['recent-conversions'],
    queryFn: async () => {
      const { localStorageManager } = await import('@/lib/localStorage');
      const conversions = await localStorageManager.getRecentConversions(5);
      console.log('🔍 Recent conversions loaded:', conversions);
      return conversions;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Probar conectividad en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      api.testConnection().then(result => {
        console.log('API Connection test:', result ? '✅ SUCCESS' : '❌ FAILED');
      });
    }
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setCurrentCategory(categoryId);
    if (categoryId === 'currency') {
      setCurrentView('currency');
    } else {
      setCurrentView('category');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Quick Search */}
      <div className="p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder={t('search.globalPlaceholder')}
            className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-colors"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Ad Space 1 */}
      <AdSpace />

      {/* Categories Grid */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('home.categories')}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="category-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-105"
            >
              <div className="text-4xl mb-3">{category.emoji}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t(`categories.${category.id}.name`)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t(`categories.${category.id}.description`)}
              </p>
              {category.id === 'currency' && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-blue-500 font-medium">
                    {t('common.advanced')}
                  </span>
                  <div className="text-gray-400">→</div>
                </div>
              )}
              {category.id !== 'currency' && (
                <div className="mt-3 flex justify-end">
                  <div className="text-gray-400">→</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Conversions */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('home.recentConversions')}
        </h2>
        
        {/* ✅ AÑADIDO: Indicadores de estado */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-red-500 dark:text-red-400">{t('common.error')}</p>
            <p className="text-sm text-gray-500 mt-1">
              {t('common.checkConnection')}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          {!isLoading && !error && recentConversions.length > 0 ? (
            recentConversions.map((conversion: Conversion) => (
              <Card key={conversion.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {categories.find(c => c.id === conversion.category)?.emoji || '🔄'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {conversion.fromValue} {conversion.fromUnit} → {conversion.toUnit}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t(`categories.${conversion.category}.name`)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {conversion.toValue}
                      </p>
                      <div className="flex items-center text-sm text-green-500">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>+0.2%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !isLoading && !error ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📋</div>
              <p>{t('home.noRecentConversions')}</p>
              <p className="text-sm mt-1">Realiza una conversión para verla aquí</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Ad Space 2 */}
      <AdSpace />
    </div>
  );
}