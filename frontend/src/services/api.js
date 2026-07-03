import apiClient from './apiClient';

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  updatePassword: (data) => apiClient.put('/auth/password', data),
};

export const storeService = {
  getStores: (params) => apiClient.get('/stores', { params }),
  getStore: (id) => apiClient.get(`/stores/${id}`),
  getStoresStats: () => apiClient.get('/stores/stats'),
  createStore: (data) => apiClient.post('/stores', data),
  updateStore: (id, data) => apiClient.put(`/stores/${id}`, data),
  deleteStore: (id) => apiClient.delete(`/stores/${id}`),
};

export const ratingService = {
  submitRating: (data) => apiClient.post('/ratings', data),
  updateRating: (id, data) => apiClient.put(`/ratings/${id}`, data),
  deleteRating: (id) => apiClient.delete(`/ratings/${id}`),
  getStoreRatings: (storeId, params) => apiClient.get(`/ratings/store/${storeId}`, { params }),
  getStoreStats: (storeId) => apiClient.get(`/ratings/store/${storeId}/stats`),
  getUserRatings: (params) => apiClient.get('/ratings/user/my-ratings', { params }),
  checkUserRating: (storeId) => apiClient.get(`/ratings/check/${storeId}`),
};

export const userService = {
  getUsers: (params) => apiClient.get('/users', { params }),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  createUser: (data) => apiClient.post('/users', data),
};
