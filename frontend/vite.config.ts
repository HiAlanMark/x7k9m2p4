import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'
import http from 'http'
import https from 'https'
import { URL } from 'url'
import fs from 'fs'
import { fileURLToPath } from 'node:url'

// 读取 package.json 获取版本号
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: path.resolve(__dirname, './src/i18n/locales/**'),
      strictMessage: false,
      escapeHtml: false,
    }),
    // 通用 CORS 代理插件
    {
      name: 'cors-proxy',
      configureServer(server) {
        server.middlewares.use('/proxy/custom', (req, res) => {
          const targetBase = req.headers['x-proxy-target'] as string
          if (!targetBase) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Missing x-proxy-target header' }))
            return
          }

          // 拼接完整 URL
          const targetPath = req.url || '/'
          const fullUrl = targetBase.replace(/\/$/, '') + targetPath
          const parsed = new URL(fullUrl)

          const transport = parsed.protocol === 'https:' ? https : http

          // 构建代理请求 headers
          const proxyHeaders: Record<string, string> = {}
          for (const [key, value] of Object.entries(req.headers)) {
            if (key === 'host' || key === 'x-proxy-target' || key === 'origin' || key === 'referer') continue
            if (value) proxyHeaders[key] = Array.isArray(value) ? value[0] : value
          }
          proxyHeaders['host'] = parsed.host

          const proxyReq = transport.request(
            fullUrl,
            { method: req.method, headers: proxyHeaders },
            (proxyRes) => {
              // 设置 CORS headers
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Access-Control-Allow-Methods', '*')
              res.setHeader('Access-Control-Allow-Headers', '*')
              res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
              proxyRes.pipe(res)
            }
          )

          proxyReq.on('error', (err) => {
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: `Proxy error: ${err.message}` }))
          })

          // 处理 preflight
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', '*')
            res.setHeader('Access-Control-Allow-Headers', '*')
            res.writeHead(204)
            res.end()
            return
          }

          req.pipe(proxyReq)
        })
      },
    },
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
          'vendor-3d': ['three', 'postprocessing', 'ogl'],
          'vendor-markdown': ['marked', 'highlight.js', 'dompurify'],
          'vendor-flow': ['@vue-flow/core', '@vue-flow/background', '@vue-flow/controls', '@vue-flow/minimap'],
        },
      },
    },
  },
  clearScreen: false,
  server: {
    host: '0.0.0.0',
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
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
      '/proxy/agent': {
        target: 'http://0.0.0.0:9800',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/agent/, ''),
      },
      '/v1': {
        target: 'http://0.0.0.0:9800',
        changeOrigin: true,
      },
    },
  },
})
