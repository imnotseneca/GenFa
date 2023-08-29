import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginRewriteAll()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://invoice-withdb-bl7o-dev.fl0.io',
        changeOrigin: true,
      }
    }
  },
  define: {
    'process.env': {}
  }
})
