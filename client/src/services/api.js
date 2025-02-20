import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_URL 
        : 'http://localhost:3000',
    withCredentials: true,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    config => {
        console.log('Making request to:', config.url);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    response => {
        console.log('Response received:', response.status);
        return response;
    },
    error => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

export default api;