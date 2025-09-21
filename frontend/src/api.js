import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

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