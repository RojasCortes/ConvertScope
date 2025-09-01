import { useAppStore } from '@/stores/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Globe, Palette, Bell, Info, Star, ExternalLink } from 'lucide-react';


export function Settings() {
  const { theme, language, setTheme, setLanguage } = useAppStore();
  const { t } = useTranslation();

  const handleRateApp = () => {
    // In a real PWA, this would open the appropriate app store
    window.open('https://play.google.com/store', '_blank');
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ConvertScope',
        text: t('settings.share.text'),
        url: window.location.href,
      });
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        ⚙️ {t('nav.settings')}
      </h2>
      
      <div className="space-y-4">
        {/* Language Setting */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="text-blue-500 text-xl" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {t('settings.language.title')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('settings.language.description')}
                  </p>
                </div>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Theme Setting */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Palette className="text-blue-500 text-xl" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {t('settings.theme.title')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('settings.theme.description')}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications - Hidden for now */}
        {false && (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="text-blue-500 text-xl" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t('settings.notifications.title')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('settings.notifications.description')}
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        )}

        {/* About */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Info className="text-blue-500 text-xl" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t('settings.about.title')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('settings.about.version')} 1.0.0
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {t('settings.about.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleShareApp}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t('settings.share.title')}</span>
          </Button>

          <Button
            onClick={handleRateApp}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2"
          >
            <Star className="w-4 h-4" />
            <span>{t('settings.rate.title')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
