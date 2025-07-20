import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartOff, Star } from 'lucide-react';
import { categories } from '@/lib/conversions';
import { apiRequest } from '@/lib/queryClient';

export function Favorites() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['/api/favorites'],
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/favorites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
  });

  const handleRemoveFavorite = (id: number) => {
    removeFavoriteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        ⭐ {t('nav.favorites')}
      </h2>
      
      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((favorite: any) => {
            const category = categories.find(c => c.id === favorite.category);
            return (
              <Card key={favorite.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700">
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
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <HeartOff className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('favorites.empty.title')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('favorites.empty.description')}
          </p>
        </div>
      )}
    </div>
  );
}
