import axios from 'axios'

const api = axios.create({
    baseURL: '/api/storefleet',
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
