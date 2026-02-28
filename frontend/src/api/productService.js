import api from './axiosInstance'

export const getAllProducts = (params) => api.get('/product/products', { params })
export const getProductDetails = (id) => api.get(`/product/details/${id}`)
export const getProductReviews = (id) => api.get(`/product/reviews/${id}`)
export const rateProduct = (id, data) => api.put(`/product/rate/${id}`, data)
export const deleteReview = (params) => api.delete('/product/review/delete', { params })

// Admin
export const addProduct = (data) => api.post('/product/add', data)
export const updateProduct = (id, data) => api.put(`/product/update/${id}`, data)
export const deleteProduct = (id) => api.delete(`/product/delete/${id}`)
