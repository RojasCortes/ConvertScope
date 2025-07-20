import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Moon className="h-5 w-5 text-gray-300" />
      )}
    </Button>
  );
}
