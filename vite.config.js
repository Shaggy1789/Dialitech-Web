import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    transformer: 'postcss',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api-dialitech-core-v2.onrender.com',
        changeOrigin: true,
      },
    },
  },
})