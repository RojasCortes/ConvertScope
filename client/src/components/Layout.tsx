import { useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { BottomNavigation } from './BottomNavigation';
import { Search, Bell, Globe } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, isSearchOpen, searchQuery, setSearchOpen, setSearchQuery } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔄</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              ConvertScope
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('search.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('search.hint')}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-30"
        size="icon"
      >
        <span className="text-xl">+</span>
      </Button>
    </div>
  );
}
