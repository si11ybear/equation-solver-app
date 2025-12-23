import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'solver.sillybear',
  appName: '方程求解器',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
