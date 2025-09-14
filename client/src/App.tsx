import { useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdSenseProvider } from '@/components/AdSenseProvider';
import { useAppStore } from '@/stores/useAppStore';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { CurrencyConverter } from '@/pages/CurrencyConverter';
import { CategoryConverter } from '@/pages/CategoryConverter';
import { Favorites } from '@/pages/Favorites';
import { Settings } from '@/pages/Settings';
import { More } from '@/pages/More';
import { RecentConversions } from '@/pages/RecentConversions';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
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
    <Switch>
      {/* Legal pages with direct URL access for AdSense compliance */}
      <Route path="/about">
        <Layout>
          <About />
        </Layout>
      </Route>
      <Route path="/contact">
        <Layout>
          <Contact />
        </Layout>
      </Route>
      <Route path="/privacy">
        <Layout>
          <Privacy />
        </Layout>
      </Route>
      <Route path="/terms">
        <Layout>
          <Terms />
        </Layout>
      </Route>
      
      {/* Main app with state-based navigation */}
      <Route path="*">
        <Layout>
          {renderCurrentView()}
        </Layout>
      </Route>
    </Switch>
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
      <AdSenseProvider>
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </AdSenseProvider>
    </QueryClientProvider>
  );
}

export default App;
