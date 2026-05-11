import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
    // 代理解决浏览器跨域问题
    proxy: {
      '/proxy/gfw': {
        target: 'https://api.gfw.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/gfw/, ''),
        secure: true,
      },
      '/proxy/2x': {
        target: 'https://api.2x.com.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/2x/, ''),
        secure: true,
      },
    },
  },
})
