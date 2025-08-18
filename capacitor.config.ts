// capacitor.config.ts - SIN INTERCEPTORS
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.convertscope.app',
  appName: 'ConvertScope',
  webDir: 'dist/public',
  server: {
    allowNavigation: [
      'https://convert-scope.vercel.app/*',
      'https://*.vercel.app/*',
      'https://api.exchangerate-api.com/*',
      'https://openexchangerates.org/*'
    ],
    cleartext: true,
    androidScheme: 'https'
  },
  plugins: {
    // ✅ DESACTIVAR CapacitorHttp - usar solo fetch
    CapacitorHttp: {
      enabled: false
    },
    CapacitorCookies: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;