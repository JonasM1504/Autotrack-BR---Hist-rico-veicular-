import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const vehicleService = {
  getAll:     (page = 0, size = 20) => api.get(`/vehicles?page=${page}&size=${size}`),
  getById:    (id)       => api.get(`/vehicles/${id}`),
  getByPlate: (plate)    => api.get(`/vehicles/plate/${plate}`),
  create:     (data)     => api.post('/vehicles', data),
  update:     (id, data) => api.put(`/vehicles/${id}`, data),
  remove:     (id)       => api.delete(`/vehicles/${id}`),
  getHistory: (vehicleId) => api.get(`/vehicles/${vehicleId}/history`),
};