import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('veloop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors uniformly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected server error occurred';
    return Promise.reject({
      ...error,
      message,
      data: error.response?.data,
      status: error.response?.status,
    });
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateShippingAddress: (address) => api.put('/auth/shipping-address', address),
  claimFaucet: () => api.post('/auth/faucet'),
};

export const giveawayAPI = {
  getAll: () => api.get('/giveaways'),
  getCurrent: () => api.get('/giveaways/current'),
  getPrevious: () => api.get('/giveaways/previous'),
  getById: (id) => api.get(`/giveaways/${id}`),
  getMyStatus: (id) => api.get(`/giveaways/${id}/my-status`),
  join: (id, payload = {}) => api.post(`/giveaways/${id}/join`, payload),
  getWinners: (id) => api.get(`/giveaways/${id}/winners`),
  getPreviousWinners: () => api.get('/giveaways/previous/winners'),
  getStatistics: () => api.get('/giveaways/statistics'),
};

export const claimAPI = {
  claimPrize: (giveawayId, claimData) => api.post(`/giveaways/${giveawayId}/claim`, claimData),
  getMyClaim: (giveawayId) => api.get(`/giveaways/${giveawayId}/my-claim`),
  getMyWins: () => api.get('/claims/my-wins'),
};

export const adminAPI = {
  getMetrics: () => api.get('/admin/metrics'),
  getGiveaways: () => api.get('/admin/giveaways'),
  createGiveaway: (data) => api.post('/admin/giveaways', data),
  updateGiveaway: (id, data) => api.put(`/admin/giveaways/${id}`, data),
  drawWinners: (id) => api.post(`/admin/giveaways/${id}/draw-winners`),
  getClaims: () => api.get('/admin/claims'),
  updateClaimStatus: (id, data) => api.put(`/admin/claims/${id}`, data),
  getParticipations: () => api.get('/admin/participations'),
  getFraudEvents: () => api.get('/admin/fraud-events'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

export default api;
