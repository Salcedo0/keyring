import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // Permite importar con '@/…' en vez de rutas relativas largas ('../../../').
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
