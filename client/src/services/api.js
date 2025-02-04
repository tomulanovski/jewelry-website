import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL, // URL of  backend
//   withCredentials: true,
// });

// export default api;

// const api = axios.create({
//     baseURL: process.env.REACT_APP_API_URL,
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });
const api = axios.create({
    baseURL: process.env.REACT_ENV === 'production' 
        ? process.env.REACT_APP_API_URL 
        : 'http://10.100.102.6:3000',
    withCredentials: true,
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