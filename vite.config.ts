import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// For a project site (https://username.github.io/repo-name), set base to '/repo-name/'
// If you later map a custom domain, '/' also works.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  base: '/'
})
