import { Home, Heart, MoreHorizontal, Settings } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const { currentView, setCurrentView } = useAppStore();
  const { t } = useTranslation();

  const navigationItems = [
    {
      id: 'home' as const,
      icon: Home,
      label: t('nav.home'),
    },
    {
      id: 'favorites' as const,
      icon: Heart,
      label: t('nav.favorites'),
    },
    {
      id: 'more' as const,
      icon: MoreHorizontal,
      label: t('nav.more'),
    },
    {
      id: 'settings' as const,
      icon: Settings,
      label: t('nav.settings'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 transition-colors duration-300">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors",
              currentView === id
                ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
