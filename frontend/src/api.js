import axios from 'axios';

// API URL configuration for different environments
const getApiUrl = () => {
  // Production environment (deployed)
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://civic-backend-v2.loca.lt/api';
  }
  
  // Development environment
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // LocalTunnel public access
  if (window.location.hostname.includes('loca.lt')) {
    return 'https://civic-backend-v2.loca.lt/api';
  }
  
  // Local network access
  return `http://${window.location.hostname}:5000/api`;
};

const API_URL = getApiUrl();

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('📥 API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      }
    });
    
    // Provide more user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - please check your connection';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error - unable to connect to server';
    } else if (error.response?.status === 401) {
      error.message = 'Authentication failed - please log in again';
      // Clear invalid token
      localStorage.removeItem('token');
    } else if (error.response?.status === 403) {
      error.message = 'Access denied - insufficient permissions';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error - please try again later';
    }
    
    return Promise.reject(error);
  }
);

export const login = async (username, password, role) => {
  try {
    const response = await api.post('/users/login', { username, password, role });
    return response.data;
  } catch (error) {
    // Enhanced error handling for login
    if (error.response?.status === 401) {
      throw new Error('Invalid username, password, or role');
    }
    throw error;
  }
};

export const createIssue = async (formData) => {
  try {
    const response = await api.post('/issues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 413) {
      throw new Error('File too large - please upload a smaller image');
    }
    throw error;
  }
};

export const getMyIssues = async () => {
  try {
    const response = await api.get('/issues/my-issues');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user issues:', error);
    throw error;
  }
};

export const getAllIssues = async () => {
  try {
    const response = await api.get('/issues');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all issues:', error);
    throw error;
  }
};

export const updateIssueStatus = async (issueId, status) => {
  try {
    const response = await api.patch(`/issues/${issueId}/status`, { status });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Issue not found');
    }
    throw error;
  }
};

export const deleteIssue = async (issueId) => {
  try {
    const response = await api.delete(`/issues/${issueId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Issue not found');
    }
    throw error;
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
};