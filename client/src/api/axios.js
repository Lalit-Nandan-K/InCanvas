import axios from 'axios';

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const baseURL = isLocalhost ? 'http://localhost:4000' : import.meta.env.VITE_BASEURL;

const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
