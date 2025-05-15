import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/myus4a.github.io/', // GitHub Pagesでの公開に必要なベースパス設定
})
