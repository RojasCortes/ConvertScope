import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useStatusBar = () => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Configurar status bar para que no se superponga
      StatusBar.setOverlaysWebView({ overlay: false });
      
      // Color de fondo igual al de tu header
      StatusBar.setBackgroundColor({ color: '#1e293b' });
      
      // Estilo del texto (dark = texto negro, light = texto blanco)
      StatusBar.setStyle({ style: Style.Dark });
    }
  }, []);
};