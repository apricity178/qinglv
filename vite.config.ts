import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时设置仓库名作为 base，本地开发时用 '/'
  base: process.env.GITHUB_PAGES === 'true' ? '/qinglv/' : '/',
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: true,
    port: 911,
    strictPort: true,
    allowedHosts: ['b4104139.xq0.cn'],
  },
})
