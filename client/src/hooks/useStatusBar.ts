import { useEffect } from 'react';

export const useStatusBar = () => {
  useEffect(() => {
    // Configurar status bar de forma segura
    const configureStatusBar = async () => {
      try {
        // @ts-ignore - Verificar si Capacitor está disponible
        if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform()) {
          const { StatusBar, Style } = await import('@capacitor/status-bar');
          
          // Configurar status bar para apps nativas
          await StatusBar.setOverlaysWebView({ overlay: false });
          await StatusBar.setBackgroundColor({ color: '#1e293b' });
          await StatusBar.setStyle({ style: Style.Light });
        } else {
          // Configuración para web
          document.title = 'ConvertScope - Universal Converter';
        }
      } catch (error) {
        console.log('StatusBar not available:', error);
        document.title = 'ConvertScope - Universal Converter';
      }
    };

    configureStatusBar();
  }, []);
};