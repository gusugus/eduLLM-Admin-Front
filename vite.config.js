import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? (process.env.VITE_BASENAME || '/') : '/',
  server: {
    port: 8001,
    host: true,
    allowedHosts: true,
  },
}));
