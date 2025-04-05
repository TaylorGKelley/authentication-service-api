import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7001/api/v1',
  timeout: 10 * 1000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
