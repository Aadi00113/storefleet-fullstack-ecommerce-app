import axios from 'axios'

// In production (Vercel), set VITE_API_BASE_URL=https://your-backend.onrender.com/api/storefleet
// In development, Vite proxy handles /api/storefleet → localhost:3000
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/storefleet',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

// response interceptor: unwrap errors
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err.response?.data?.error ||
            err.response?.data?.msg ||
            err.message ||
            'Something went wrong'
        return Promise.reject(new Error(message))
    }
)

export default api
