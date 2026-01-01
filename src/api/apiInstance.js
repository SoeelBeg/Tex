// src/api/apiInstance.js
import axios from "axios";

// Central Axios instance for whole app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // env based URL
  timeout: 15000,
});

// Attach token before every request  
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
