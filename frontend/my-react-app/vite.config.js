import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Social-Media-App/' : '/',
  test:{
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },

  
}))