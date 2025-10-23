import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL // e.g., https://your-backend-render-url.onrender.com
});

export default api;
