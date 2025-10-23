import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL // e.g., https://student-records-backend.onrender.com
});

export default api;
