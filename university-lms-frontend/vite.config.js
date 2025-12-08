import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/assets': '/src/assets',
      '@/styles': '/src/styles',
      '@/lib': '/src/lib',
      '@/services': '/src/services',
      '@/store': '/src/store',
      '@/hooks': '/src/hooks',
      '@/router': '/src/router',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    sourcemap: true,
  },
});