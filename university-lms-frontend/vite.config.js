import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * Vite configuration for the University LMS frontend.
 * - React plugin for JSX/fast refresh.
 * - Path aliases aligned with jsconfig.json for cleaner imports.
 * - Dev server defaults (port 5173, auto-open).
 * - Build generates sourcemaps for easier debugging in production.
 */

export default defineConfig({
  plugins: [react()],

  // Resolve aliases to avoid long relative paths (e.g., "../../../components")
  resolve: {
    alias: {
      '@': '/src',
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

  // Dev server settings
  server: {
    port: 5173,
    open: true, // auto-open browser on dev start
  },

  // Build settings
  build: {
    sourcemap: true, // generate source maps for production debugging
  },
});
