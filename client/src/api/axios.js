import axios from 'axios';

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const baseURL = isLocalhost ? 'http://localhost:4000' : import.meta.env.VITE_BASEURL;
const AUTH_TOKEN_KEY = 'incanvas_token';

const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api
export { AUTH_TOKEN_KEY };
