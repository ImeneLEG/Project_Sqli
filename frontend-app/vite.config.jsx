import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://localhost:7276', // le port que vous avez dans swagger lorsque vous fetes try out
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
