import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL;
if(!BASE_URL?.trim()) {
    throw new Error("VITE_API_URL is not set");
}

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': "application/json"
    },
    timeout: 10000
});

export interface ApiErrorResponse{
    statusCode: number;
    message: string;
    details?: string;
}

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use( response => response, error => {    
    if(error.response?.status === 401){
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
});

