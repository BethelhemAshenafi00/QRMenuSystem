import axios from 'axios';

const api = axios.create({
  baseURL: 'https://qrmenusystem.onrender.com/api',
});

// Ensure JSON payloads use the correct Content-Type
// (Axios will set it automatically for plain objects in most cases,
// but we also set it for safety when sending JSON.)
api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};

  const hasBody = config.data !== undefined && config.data !== null;
  const isPlainObject =
    typeof config.data === 'object' &&
    !Array.isArray(config.data) &&
    Object.prototype.toString.call(config.data) === '[object Object]';

  if (hasBody && isPlainObject) {
    (config.headers as Record<string, unknown>)['Content-Type'] = 'application/json';
  }

  return config;
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;