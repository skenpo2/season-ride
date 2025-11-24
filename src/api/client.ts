import axios from 'axios';

// CHANGE THIS URL TO YOUR REAL BACKEND
const BASE_URL = 'https://voya-season-backend.onrender.com/api';
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Optional: Add interceptors for auth tokens if needed later
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
