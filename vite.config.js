import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? (process.env.VITE_BASENAME || '/') : '/',
  server: {
    port: 8001,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/docs/**', '**/public/**']
    }
  },
}));
