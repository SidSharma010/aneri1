import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1'
});

api.interceptors.request.use((config) => {
  const token = 'replace-with-auth-token';
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
