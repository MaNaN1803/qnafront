import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Ensure no extra chunks are created
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Optional: Alias to simplify imports
    },
  },
});
