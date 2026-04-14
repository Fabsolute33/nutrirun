import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/food-search': {
        target: 'https://world.openfoodfacts.org',
        changeOrigin: true,
        rewrite: (path) => {
          const qs = path.includes('?') ? path.split('?')[1] : '';
          const params = new URLSearchParams(qs);
          const q = params.get('q') || '';
          return `/api/v2/search?search_terms=${encodeURIComponent(q)}&page_size=10&fields=code,product_name,brands,nutriments&lc=fr&cc=fr`;
        },
      },
    },
  },
})
