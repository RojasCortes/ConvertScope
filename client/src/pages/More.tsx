import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdSpace } from '@/components/AdSpace';
import { 
  Calculator, 
  History, 
  Download, 
  Share2, 
  HelpCircle, 
  Star,
  ExternalLink,
  Coffee,
  Github,
  Mail
} from 'lucide-react';

export function More() {
  const { t } = useTranslation();

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ConvertScope',
        text: t('settings.share.text'),
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert('Link copiado al portapapeles');
    }
  };

  const handleRateApp = () => {
    window.open('https://play.google.com/store', '_blank');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@convertscope.com', '_blank');
  };

  const handleViewGithub = () => {
    window.open('https://github.com/convertscope', '_blank');
  };

  const handleDonation = () => {
    // In a real app, this would open a donation platform
    alert('¡Gracias por tu apoyo! Esta función estará disponible pronto.');
  };

  const moreOptions = [
    {
      id: 'calculator',
      icon: Calculator,
      title: 'Calculadora Avanzada',
      description: 'Calculadora científica integrada',
      action: () => alert('Función próximamente disponible'),
      color: 'text-blue-500'
    },
    {
      id: 'history',
      icon: History,
      title: 'Historial Completo',
      description: 'Ver todas las conversiones realizadas',
      action: () => alert('Función próximamente disponible'),
      color: 'text-green-500'
    },
    {
      id: 'offline',
      icon: Download,
      title: 'Modo Offline',
      description: 'Usar sin conexión a internet',
      action: () => alert('¡Ya disponible! Prueba sin conexión.'),
      color: 'text-purple-500'
    },
    {
      id: 'share',
      icon: Share2,
      title: 'Compartir App',
      description: 'Recomienda ConvertScope a tus amigos',
      action: handleShareApp,
      color: 'text-orange-500'
    }
  ];

  const supportOptions = [
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Ayuda y Soporte',
      description: 'Preguntas frecuentes y contacto',
      action: handleContactSupport,
      color: 'text-blue-500'
    },
    {
      id: 'rate',
      icon: Star,
      title: 'Calificar App',
      description: 'Danos tu opinión en la tienda',
      action: handleRateApp,
      color: 'text-yellow-500'
    },

    {
      id: 'donate',
      icon: Coffee,
      title: 'Apoyar Desarrollo',
      description: 'Ayuda a mantener la app gratuita',
      action: handleDonation,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        🌟 {t('nav.more')}
      </h2>
      
      {/* Features Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Funciones Adicionales
        </h3>
        <div className="space-y-3">
          {moreOptions.map((option) => (
            <Card key={option.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <button 
                  onClick={option.action}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className={`text-xl ${option.color}`} />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {option.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ad Space */}
      <AdSpace />

      {/* Support Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Soporte y Comunidad
        </h3>
        <div className="space-y-3">
          {supportOptions.map((option) => (
            <Card key={option.id} className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <button 
                  onClick={option.action}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className={`text-xl ${option.color}`} />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {option.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* App Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">🔄</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ConvertScope v1.0.0
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            El convertidor universal más completo y gratuito
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              170+ Monedas
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
              9 Categorías
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
              PWA
            </span>
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
              Offline
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Ad Space */}
      <AdSpace className="mt-6" />
    </div>
  );
}