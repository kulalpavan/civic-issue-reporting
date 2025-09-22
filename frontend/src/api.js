import axios from 'axios';

// API URL configuration for different environments
const getApiUrl = () => {
  // Production environment (deployed frontend)
  if (import.meta.env.PROD) {
    // Try Railway first, fallback to current host with port 5000
    const railwayUrl = 'https://civicissue-production.up.railway.app/api';
    const fallbackUrl = `http://${window.location.hostname}:5000/api`;
    
    // For now, use fallback since Railway has deployment issues
    console.log('🌐 Production mode detected, using fallback:', fallbackUrl);
    return fallbackUrl;
  }
  
  // Development environment - smart detection
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Running on localhost
    console.log('💻 Localhost detected');
    return 'http://localhost:5000/api';
  } else {
    // Running on network IP (like 10.219.88.162)
    console.log('📱 Network access detected from:', hostname);
    return `http://${hostname}:5000/api`;
  }
};

const API_URL = getApiUrl();

console.log('🔗 API URL:', API_URL);

// Test connection and provide fallback options
const testApiConnection = async (url) => {
  try {
    const response = await fetch(`${url}/test`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn(`Connection test failed for ${url}:`, error.message);
    return false;
  }
};

// Smart API URL with automatic fallback
let currentApiUrl = API_URL;

const getWorkingApiUrl = async () => {
  const hostname = window.location.hostname;
  const possibleUrls = [];
  
  // Add current detected URL first
  possibleUrls.push(currentApiUrl);
  
  // Add fallback URLs based on environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    possibleUrls.push('http://localhost:5000/api');
    possibleUrls.push(`http://10.219.88.162:5000/api`); // Common network IP
  } else {
    possibleUrls.push(`http://${hostname}:5000/api`);
    possibleUrls.push('http://localhost:5000/api');
  }
  
  // Remove duplicates
  const uniqueUrls = [...new Set(possibleUrls)];
  
  console.log('🔍 Testing API connections:', uniqueUrls);
  
  for (const url of uniqueUrls) {
    const baseUrl = url.replace('/api', '');
    if (await testApiConnection(baseUrl)) {
      console.log('✅ Found working API:', url);
      currentApiUrl = url;
      return url;
    }
  }
  
  console.warn('⚠️ No working API found, using default:', currentApiUrl);
  return currentApiUrl;
};

// Initialize with working URL
getWorkingApiUrl().then(url => {
  console.log('🚀 API initialized with:', url);
});

const api = axios.create({
  baseURL: currentApiUrl,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update base URL dynamically
const updateApiBaseUrl = async () => {
  const workingUrl = await getWorkingApiUrl();
  api.defaults.baseURL = workingUrl;
  return workingUrl;
};

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
  async (error) => {
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
    
    // If it's a network error, try to find a working API URL
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.log('🔄 Network error detected, trying to find working API...');
      try {
        const newUrl = await updateApiBaseUrl();
        if (newUrl !== error.config.baseURL) {
          console.log('🔄 Retrying request with new URL:', newUrl);
          // Clone the original request config with new base URL
          const retryConfig = { ...error.config, baseURL: newUrl };
          return api.request(retryConfig);
        }
      } catch (retryError) {
        console.error('🚫 Retry failed:', retryError);
      }
    }
    
    // Provide more user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - please check your connection';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error - unable to connect to server. Please ensure the backend is running.';
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
    await updateApiBaseUrl(); // Ensure we're using the best URL
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
};

// Get current API URL for debugging
export const getCurrentApiUrl = () => currentApiUrl;

// Manual API URL update (useful for troubleshooting)
export const refreshApiConnection = () => updateApiBaseUrl();