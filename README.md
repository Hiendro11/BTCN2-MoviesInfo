

## Chạy project

```bash
npm install
npm start   # hoặc: npm run dev
```

Tạo file `.env.local`:
Em đã push cả file .env.local, nhưng trường hợp nếu sau này e có xóa thì xin thầy hãy set up như dưới cho em ạ 
```env
VITE_API_BASE_URL=https://34.124.214.214:2423
VITE_API_TOKEN=YOUR_APP_TOKEN_HERE
```
Cấu hình proxy cho Vite
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://34.124.214.214:2423',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

