import axios from 'axios';

// API URL configuration for different environments
const getApiUrl = () => {
  // Production environment (deployed)
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://civic-issue-reporting-production.up.railway.app/api';
  }
  
  // Development environment
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // Local network access
  return `http://${window.location.hostname}:5000/api`;
};

const API_URL = getApiUrl();

console.log('API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data); // Debug log
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data); // Debug log
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message); // Debug log
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password, role) => {
  const response = await api.post('/users/login', { username, password, role });
  return response.data;
};

export const createIssue = async (formData) => {
  const response = await api.post('/issues', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getMyIssues = async () => {
  const response = await api.get('/issues/my-issues');
  return response.data;
};

export const getAllIssues = async () => {
  const response = await api.get('/issues');
  return response.data;
};

export const updateIssueStatus = async (issueId, status) => {
  const response = await api.patch(`/issues/${issueId}/status`, { status });
  return response.data;
};

export const deleteIssue = async (issueId) => {
  const response = await api.delete(`/issues/${issueId}`);
  return response.data;
};