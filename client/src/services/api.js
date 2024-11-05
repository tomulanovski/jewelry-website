import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL of your backend
});

export default api;