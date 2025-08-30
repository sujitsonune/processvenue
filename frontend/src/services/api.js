import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com/api' 
    : '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Don't show toast for certain endpoints or status codes
    if (error.response?.status !== 404 && !error.config?.hideErrorToast) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  health: () => api.get('/health'),

  // Profile endpoints
  profile: {
    get: () => api.get('/profile'),
    create: (data) => api.post('/profile', data),
    update: (data) => api.put('/profile', data),
    patch: (data) => api.patch('/profile', data),
  },

  // Skills endpoints
  skills: {
    getAll: (params = {}) => api.get('/skills', { params }),
    getTop: (params = {}) => api.get('/skills/top', { params }),
    create: (data) => api.post('/skills', data),
  },

  // Projects endpoints
  projects: {
    getAll: (params = {}) => api.get('/projects', { params }),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
  },

  // Search endpoint
  search: (params) => api.get('/search', { params }),
};

export default api;