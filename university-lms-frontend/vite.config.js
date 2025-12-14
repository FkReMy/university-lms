/**
 * Vite configuration for University LMS Frontend
 * --------------------------------------------------------------------------
 * - Enables React fast refresh and modern JSX support.
 * - Standardizes path aliases (update here and in jsconfig/tsconfig for sync).
 * - Dev server: accessible on all interfaces, allows external testing, runs on port 5000.
 * - Source maps enabled for easier production debugging.
 * - No demo/samples – production-ready baseline.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react()
  ],

  // Path aliases for clean and consistent imports across the repo
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

  server: {
    port: 5000,          // Accessible at http://localhost:5000/
    host: '0.0.0.0',     // Listen on all network interfaces
    allowedHosts: 'all', // Accept requests from any host (internal/external)
    open: false,         // Do not auto-open browser (CI/CD/devops friendly)
  },

  build: {
    sourcemap: true,      // Enable source maps for production debugging
    outDir: 'dist',       // Production build output directory
    emptyOutDir: true,    // Clean output dir on build
    minify: 'esbuild',    // Use esbuild for fast minification
    reportCompressedSize: true, // Show compressed size in build logs
  },
});