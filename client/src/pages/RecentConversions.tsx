import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { categories } from '@/lib/conversions';

export function RecentConversions() {
  const { t } = useTranslation();
  const { setCurrentView } = useAppStore();

  // Usar sistema híbrido para conversiones recientes
  const { data: conversions = [], isLoading, error } = useQuery({
    queryKey: ['recent-conversions'],
    queryFn: async () => {
      const { hybridStorage } = await import('@/lib/storage');
      return hybridStorage.getRecentConversions(15);
    },
    staleTime: 60 * 1000, // 1 minuto cache
    retry: 2
  });

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="animate-fade-in p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentView('more')}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back')}</span>
          </Button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🕒 {t('conversions.recent')}
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
      <div className="animate-fade-in p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentView('more')}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back')}</span>
          </Button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🕒 {t('conversions.recent')}
        </h2>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-500 dark:text-red-400">Error al cargar conversiones</p>
          <p className="text-sm text-gray-500 mt-1">
            Verifica tu conexión a internet
          </p>
        </div>
      </div>
    );
  }

  // Función para obtener el emoji de la categoría
  const getCategoryEmoji = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '🔄';
  };

  // Función para formatear fecha relativa
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="animate-fade-in">
      {/* Header con botón de regreso */}
      <div className="p-4 pb-2">
        <Button
          variant="ghost"
          onClick={() => setCurrentView('more')}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">{t('common.back')}</span>
        </Button>
      </div>

      {/* Título */}
      <div className="px-4 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🕒 {t('conversions.recent')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {t('conversions.recentDescription')}
        </p>
      </div>

      {/* Lista de conversiones */}
      <div className="px-4 space-y-3">
        {conversions.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('conversions.noRecent')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t('conversions.noRecentDescription')}
              </p>
              <Button
                onClick={() => setCurrentView('home')}
                className="mt-4"
                variant="outline"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('conversions.startConverting')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          conversions.map((conversion) => (
            <Card
              key={conversion.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getCategoryEmoji(conversion.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(conversion.timestamp)}</span>
                        <span>•</span>
                        <span className="capitalize">{conversion.category}</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {conversion.fromValue} {conversion.fromUnit}
                        <span className="mx-2 text-blue-500">→</span>
                        {conversion.toValue} {conversion.toUnit}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Footer con información de sincronización */}
      <div className="p-4 mt-6">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${navigator.onLine ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            <span>
              {navigator.onLine ? 'Conectado' : 'Offline'} • 
              {conversions.length} conversión{conversions.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}