import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        open: true,  // pour ouvrir automatiquement dans le navigateur
    },
});
