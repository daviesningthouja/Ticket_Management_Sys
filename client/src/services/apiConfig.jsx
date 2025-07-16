// src/services/apiConfig.js
import axios from 'axios';
export const API_URL = "https://localhost:7204/api"; 
const BASE_URL = "https://localhost:7204";

const api = axios.create({
    baseURL: API_URL,
    headers:{
        'crossOrigin': 'anonymous',
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error) => Promise.reject(error));

export const getImageUrl = (imgPath) => {
    if(!imgPath) return 'No image available';
    return `${BASE_URL}/${imgPath}`;
}

export default api;