import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // URL of  backend
  withCredentials: true,
});

export default api;