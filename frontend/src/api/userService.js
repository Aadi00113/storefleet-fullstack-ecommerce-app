import api from './axiosInstance'

export const signupUser = (data) => api.post('/user/signup', data)
export const loginUser = (data) => api.post('/user/login', data)
export const logoutUser = () => api.get('/user/logout')
export const getUserProfile = () => api.get('/user/details')
export const updateUserProfile = (data) => api.put('/user/profile/update', data)
export const updatePassword = (data) => api.put('/user/password/update', data)
export const forgotPassword = (data) => api.post('/user/password/forget', data)
export const resetPassword = (token, data) => api.put(`/user/password/reset/${token}`, data)

// Admin
export const getAllUsers = () => api.get('/user/admin/allusers')
export const getUserById = (id) => api.get(`/user/admin/details/${id}`)
export const updateUserRole = (id, data) => api.put(`/user/admin/update/${id}`, data)
export const deleteUser = (id) => api.delete(`/user/admin/delete/${id}`)
