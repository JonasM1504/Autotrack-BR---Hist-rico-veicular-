import axios from 'axios';

export const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1')
  .replace(/\/api\/v1$/, '');

const api = axios.create({ baseURL: `${BASE_URL}/api/v1` });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
