import axios from 'axios';
import { clearAuth } from './authUtils';

const api = axios.create({
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;