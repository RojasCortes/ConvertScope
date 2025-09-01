import { useEffect } from 'react';

export const useStatusBar = () => {
  useEffect(() => {
    // Configurar status bar de forma segura
    const configureStatusBar = () => {
      try {
        // Verificar si estamos en una app nativa de Capacitor
        // @ts-ignore
        if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform()) {
          // En apps nativas, Capacitor manejará el status bar automáticamente
          // usando la configuración en capacitor.config.ts
          console.log('Native app detected, using Capacitor config for StatusBar');
        } else {
          // Configuración para web
          document.title = 'ConvertScope - Universal Converter';
          
          // Configurar meta theme-color para web
          const metaThemeColor = document.querySelector('meta[name="theme-color"]');
          if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#1e293b');
          } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#1e293b';
            document.getElementsByTagName('head')[0].appendChild(meta);
          }
        }
      } catch (error) {
        console.log('StatusBar configuration not available:', error);
        document.title = 'ConvertScope - Universal Converter';
      }
    };

    configureStatusBar();
  }, []);
};