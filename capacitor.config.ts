import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.convertscope.app',
  appName: 'ConvertScope',
  webDir: 'dist/public', // Ajustar según tu estructura
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e293b",
      showSpinner: false
    },
    StatusBar: {
      backgroundColor: "#1e293b", // Mismo color que tu header
      overlaysWebView: false // ¡CLAVE! Esto evita que se superponga
    }
  }
};

export default config;