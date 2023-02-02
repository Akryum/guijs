import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [
    vue(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  optimizeDeps: {
    include: [
      'graphql-tag',
    ],
  },
})
