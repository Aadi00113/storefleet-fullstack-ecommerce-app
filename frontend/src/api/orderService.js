import api from './axiosInstance'

export const placeOrder = (data) => api.post('/order/new', data)
