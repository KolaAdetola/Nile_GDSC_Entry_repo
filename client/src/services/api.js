import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const errors = error.response?.data?.errors || [message];
    
    return Promise.reject({
      message,
      errors,
      status: error.response?.status
    });
  }
);

export const submissionAPI = {
  create: (data) => api.post('/submissions', data),
  getAll: () => api.get('/submissions'),
};

export default api;