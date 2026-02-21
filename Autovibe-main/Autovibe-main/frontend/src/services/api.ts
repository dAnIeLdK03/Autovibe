import axios from 'axios'
import { extractApiErrorMessage } from '../Validations/extractApiErrorMessage';
import toast from 'react-hot-toast';

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

api.interceptors.response.use(response => response, error => {
    const message = extractApiErrorMessage(error);
    const status = error.response?.status;

    if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
    }

    if (status === 403) {
        toast.error("You are not allowed to perform this action.", {
            duration: 4000,
            position: "top-right",
        });
    } else {
        toast.error(message, {
            id:message,
    duration: 5000,
    position: "top-right",
    style: {
        background: '#1e293b',
        color: '#fff',
        borderRadius: '12px',
        border: '1px solid #ef4444',
    },
    iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
    },
});
    }

    return Promise.reject(error);
});

