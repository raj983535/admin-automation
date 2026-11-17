import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: './.vite-cache',
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
    open: true,
  },
  build: {
    outDir: 'build',
    emptyOutDir: false,
  },
});
