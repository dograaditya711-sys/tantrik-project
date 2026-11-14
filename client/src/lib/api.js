import axios from 'axios';
import { API_URL } from '../config';

// 🎯 FIX (H1): Axios instance — baseURL auto, Authorization auto
const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — token auto attach
api.interceptors.request.use((config) => {
    // User ya Tantrik token — dono support
    const token = localStorage.getItem('token') || localStorage.getItem('tantrikToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;