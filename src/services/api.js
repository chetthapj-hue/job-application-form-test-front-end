import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchDepartments = () => API.get('/departments');
export const loginAdmin = (credentials) => API.post('/auth/login', credentials);
export const createDepartment = (data) => API.post('/departments', data);
export const updateDepartment = (id, data) => API.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => API.delete(`/departments/${id}`);

export const fetchApplicants = (params) => API.get('/applicants', { params });
export const fetchApplicantStats = () => API.get('/applicants/stats');
export const createApplicant = (formData) => API.post('/applicants', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateApplicantStatus = (id, status) => API.patch(`/applicants/${id}/status`, { status });
export const fetchApplicantById = (id) => API.get(`/applicants/${id}`);

export default API;
