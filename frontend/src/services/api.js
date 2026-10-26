import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cyberflix_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear auth and redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cyberflix_token');
      localStorage.removeItem('cyberflix_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  toggleWishlist: (productId) => api.post(`/auth/wishlist/${productId}`),
};

// ─── Products ─────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  search: (q) => api.get('/products/search', { params: { q } }),
  getByCategory: (cat, params) => api.get(`/products/category/${cat}`, { params }),
};

// ─── Cart ─────────────────────────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, qty) => api.post('/cart', { productId, qty }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
};

// ─── Orders ───────────────────────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  verifyPayment: (orderId, data) => api.post(`/orders/${orderId}/pay`, data),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// ─── Builder ──────────────────────────────────────────────────────────────
export const builderAPI = {
  checkCompatibility: (components) => api.post('/builder/check', { components }),
  saveB: (data) => api.post('/builder/save', data),
  getMyBuilds: () => api.get('/builder/my'),
  deleteBuild: (id) => api.delete(`/builder/${id}`),
};

// ─── Reviews ──────────────────────────────────────────────────────────────
export const reviewAPI = {
  getForProduct: (productId) => api.get(`/reviews/${productId}`),
  add: (productId, data) => api.post(`/reviews/${productId}`, data),
};

// ─── Admin ────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default api;
