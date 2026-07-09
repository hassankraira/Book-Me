import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bookme.app',
  appName: 'BookMe',
  webDir: 'dist/bookme/browser',
  server: {
    hostname: 'localhost',
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
