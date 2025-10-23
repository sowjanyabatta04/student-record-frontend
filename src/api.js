import axios from "axios";

// Axios instance with base URL pointing to your backend
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL // Example: https://student-records-backend.onrender.com
});

export default api;
