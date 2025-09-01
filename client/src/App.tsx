import { useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/stores/useAppStore';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { CurrencyConverter } from '@/pages/CurrencyConverter';
import { CategoryConverter } from '@/pages/CategoryConverter';
import { Favorites } from '@/pages/Favorites';
import { Settings } from '@/pages/Settings';
import { More } from '@/pages/More';
import { RecentConversions } from '@/pages/RecentConversions';
import NotFound from '@/pages/not-found';
import { registerServiceWorker } from '@/lib/pwa';
import { useStatusBar } from './hooks/useStatusBar';

function AppRoutes() {
  const currentView = useAppStore((state) => state.currentView);
  useStatusBar(); 
  
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'currency':
        return <CurrencyConverter />;
      case 'category':
        return <CategoryConverter />;
      case 'favorites':
        return <Favorites />;
      case 'more':
        return <More />;
      case 'settings':
        return <Settings />;
      case 'recent-conversions':
        return <RecentConversions />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout>
      {renderCurrentView()}
    </Layout>
  );
}

function App() {
  useEffect(() => {
    // Registrar service worker de forma segura
    const setupApp = async () => {
      try {
        // @ts-ignore - Verificar Capacitor
        const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
        
        // Solo registrar service worker en producción web (no en apps nativas)
        if (import.meta.env.PROD && !isNative) {
          registerServiceWorker();
        }
      } catch (error) {
        // Fallback para web si hay errores
        if (import.meta.env.PROD) {
          registerServiceWorker();
        }
      }
    };

    setupApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
