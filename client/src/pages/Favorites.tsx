// client/src/pages/Favorites.tsx - CORREGIDO
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartOff, Star } from 'lucide-react';
import { categories } from '@/lib/conversions';
import { api, type Favorite } from '@/lib/api'; // ¡USAR TU API con tipos!

export function Favorites() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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
          <p className="text-red-500 dark:text-red-400">Error al cargar favoritos</p>
          <p className="text-sm text-gray-500 mt-1">
            Verifica tu conexión a internet
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['favorites'] })}
            className="mt-4"
          >
            Reintentar
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
          {favorites.map((favorite: Favorite) => {
            const category = categories.find(c => c.id === favorite.category);
            const isRemoving = removeFavoriteMutation.isPending;
            
            return (
              <Card key={favorite.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{category?.emoji || '🔄'}</div>
                      <div>
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
                </CardContent>
              </Card>
            );
          })}
          
          {/* ✅ AÑADIDO: Información adicional */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {favorites.length} favorito{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
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
            💡 Ve a cualquier conversor y toca el ❤️ para agregar favoritos
          </p>
        </div>
      )}
    </div>
  );
}