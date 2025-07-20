import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useAppStore();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
    >
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {language.toUpperCase()}
      </span>
    </Button>
  );
}
