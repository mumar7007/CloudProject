import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
const DB_PORT = process.env.REACT_APP_DB_PORT || '3306';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Content API
export const contentAPI = {
  getAll: (filters) => api.get('/content', { params: filters }),
  getById: (id) => api.get(`/content/${id}`),
  create: (contentData) => api.post('/content', contentData),
  update: (id, contentData) => api.put(`/content/${id}`, contentData),
  delete: (id) => api.delete(`/content/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteFile: (key) => api.delete(`/upload/${key}`),
};

export { API_URL, FRONTEND_URL, DB_PORT };
export default api; 