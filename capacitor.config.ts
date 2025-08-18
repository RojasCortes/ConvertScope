// capacitor.config.ts - CORREGIDO
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.convertscope.app', // Cambia por tu ID real
  appName: 'ConvertScope',
  webDir: 'dist/public', // Ajusta según tu estructura
  server: {
    // URLs permitidas para APIs
    allowNavigation: [
      'https://convert-scope.vercel.app/*',
      'https://*.vercel.app/*',
      'https://api.exchangerate-api.com/*',
      'https://openexchangerates.org/*'
    ],
    // Permitir HTTP para desarrollo local
    cleartext: true,
    // Usar HTTPS para Android (recomendado)
    androidScheme: 'https'
  },
  plugins: {
    // Configuración para depuración
    CapacitorCookies: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e293b",
      showSpinner: false
    },
    StatusBar: {
      backgroundColor: "#1e293b", // Mismo color que tu header
      overlaysWebView: false // ¡CLAVE! Esto evita que se superponga
    }
  },
  android: {
    // Permitir contenido mixto para desarrollo
    allowMixedContent: true,
    // Capturar input para formularios
    captureInput: true,
    // Habilitar debugging (solo desarrollo)
    webContentsDebuggingEnabled: process.env.NODE_ENV === 'development',
    // Configuración de red
    loggingBehavior: 'debug'
  },
  ios: {
    // Configuración iOS (para futuro)
    contentInset: 'automatic'
  }
};

export default config;