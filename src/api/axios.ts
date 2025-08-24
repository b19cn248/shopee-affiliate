import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../types/voucher';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add username header if available
    const username = localStorage.getItem('username');
    if (username) {
      config.headers['X-Username'] = username;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.message || 'An error occurred';
      console.error('API Error:', {
        status: error.response.status,
        message: errorMessage,
        traceId: error.response.data?.trace_id,
      });
      
      // Handle specific error codes
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;