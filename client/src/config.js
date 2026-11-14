// 🎯 FIX (H1): API URL ek jagah se — env variable
// Local: .env mein VITE_API_URL=http://localhost:5000
// Prod:  VITE_API_URL=https://api.yourdomain.com
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';