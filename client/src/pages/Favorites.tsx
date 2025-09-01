// client/src/pages/Favorites.tsx - CORREGIDO
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartOff, Star, ArrowRight } from 'lucide-react';
import { categories } from '@/lib/conversions';
import { useAppStore } from '@/stores/useAppStore';

export function Favorites() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setCurrentView, setCurrentCategory } = useAppStore();

  // Usar almacenamiento local para favoritos
  const { data: favorites = [], isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { localStorageManager } = await import('@/lib/localStorage');
      return localStorageManager.getFavorites();
    },
    staleTime: 2 * 60 * 1000,
    retry: 3
  });

  // Usar almacenamiento local para eliminar favoritos
  const removeFavoriteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Removing favorite with ID:', id);
      const { localStorageManager } = await import('@/lib/localStorage');
      return localStorageManager.removeFavorite(id);
    },
    onSuccess: (data, id) => {
      console.log('Favorite removed successfully:', id);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Failed to remove favorite:', error);
    }
  });

  const handleRemoveFavorite = (id: string) => {
    if (removeFavoriteMutation.isPending) return;
    removeFavoriteMutation.mutate(id);
  };

  const handleGoToConversion = (favorite: any) => {
    console.log('🚀 Navigating to favorite conversion:', favorite);
    
    if (favorite.category === 'currency') {
      // Navigate to currency converter and set currencies
      const { setFromCurrency, setToCurrency } = useAppStore.getState();
      setFromCurrency(favorite.fromUnit);
      setToCurrency(favorite.toUnit);
      setCurrentView('currency');
    } else {
      // Navigate to category converter and set units
      const { setFromUnit, setToUnit } = useAppStore.getState();
      setCurrentCategory(favorite.category);
      setFromUnit(favorite.fromUnit);
      setToUnit(favorite.toUnit);
      setCurrentView('category');
    }
    
    console.log('✅ Navigation completed with units:', {
      category: favorite.category,
      from: favorite.fromUnit,
      to: favorite.toUnit
    });
  };

  // ✅ AÑADIDO: Estados de carga y error
  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ⭐ {t('nav.favorites')}
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ⭐ {t('nav.favorites')}
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-500 dark:text-red-400">
            {t('common.error')}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {t('common.checkConnection')}
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['favorites'] })}
            className="mt-4"
          >
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        ⭐ {t('nav.favorites')}
      </h2>
      
      {Array.isArray(favorites) && favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((favorite: any) => {
            const category = categories.find(c => c.id === favorite.category);
            const isRemoving = removeFavoriteMutation.isPending;
            
            return (
              <Card key={favorite.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="text-2xl">{category?.emoji || '🔄'}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {favorite.fromUnit} → {favorite.toUnit}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t(`categories.${favorite.category}.name`)}
                        </p>
                        {/* ✅ AÑADIDO: Mostrar fecha de creación */}
                        {favorite.createdAt && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(favorite.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Go to Conversion Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGoToConversion(favorite)}
                        className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 border-blue-200 hover:border-blue-300"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-xs">{t('common.convert')}</span>
                      </Button>
                      
                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        disabled={isRemoving}
                        className={`p-2 text-gray-400 hover:text-red-500 transition-colors ${isRemoving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isRemoving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <HeartOff className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {/* ✅ AÑADIDO: Información adicional */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('favorites.empty.title')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('favorites.empty.description')}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            💡 {t('favorites.empty.instruction')}
          </p>
        </div>
      )}
    </div>
  );
}