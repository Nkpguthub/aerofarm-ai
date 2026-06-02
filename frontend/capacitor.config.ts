import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.aerofarm.app',
  appName: 'AeroFarm AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Use live Vercel URL for network requests
    url: 'https://aerofarm-ai.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0a0f1e',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0f1e',
      showSpinner: false,
    },
  },
};

export default config;
