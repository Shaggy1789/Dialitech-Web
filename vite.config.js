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
        secure: true,
        timeout: 120000,
        proxyTimeout: 120000,
        configure(proxy) {
          proxy.on('error', (err, req, res) => {
            if (res.headersSent) {
              res.destroy();
              return;
            }
            const message = err.code === 'ECONNRESET' || /TLS|socket hang up/i.test(err.message)
              ? 'Server is starting up, please retry.'
              : 'Could not reach the server.';
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ title: 'Gateway Error', message, status: 502 }));
          });
        },
      },
    },
  },
})