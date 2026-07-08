import axios from 'axios';
import { sanitizeData } from '../utils/sanitize';
import { redirectToLogin } from '../utils/auth';
import { GATEWAY } from '../config';

const api = axios.create({
  baseURL: `${GATEWAY}/api/admin`,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  if (config.data && ['post', 'put', 'patch'].includes(config.method)) {
    if (typeof config.data === 'object' && !(config.data instanceof FormData)) {
      config.data = sanitizeData(config.data);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    if (error.response?.status === 403) {
//      window.location.href = '/forbidden';
    }
    return Promise.reject(error);
  }
);

export default api;
