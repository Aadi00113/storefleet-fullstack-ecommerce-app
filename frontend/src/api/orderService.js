import api from './axiosInstance'

export const placeOrder = (data) => api.post('/order/new', data)
export const getMyOrders = () => api.get('/order/myorders')
export const getSingleOrder = (id) => api.get(`/order/${id}`)
export const getAllOrders = () => api.get('/order/admin/all')
export const updateOrderStatus = (id, status) => api.put(`/order/admin/${id}`, { status })
