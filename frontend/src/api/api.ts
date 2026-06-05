import axios from 'axios'
import { extractApiErrorMessage } from '../shared/extractErrorMessage/extractApiErrorMessage';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logout } from '@autovibe/app-state';

export const API_ORIGIN = import.meta.env.VITE_API_URL;
if (!API_ORIGIN?.trim()) {
    throw new Error("VITE_API_URL is not set");
}

const BASE_URL = `${API_ORIGIN.replace(/\/+$/, "")}/api`;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': "application/json"
    },
    timeout: 10000
});

export interface ApiErrorResponse {
    statusCode: number;
    message: string;
    details?: string;
}

const isAuthRoute = (url?: string) => {
    if (!url) return false;
    return /\/auth\/(login|register)\/?$/i.test(url);
};

api.interceptors.request.use(config => {
    if (isAuthRoute(config.url)) {
        return config;
    }
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(response => response, error => {
    const message = extractApiErrorMessage(error);
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';

    if (status === 401) {
        localStorage.removeItem("token");
        const dispatch = useDispatch();
        if (!isAuthRoute(requestUrl)) {
            dispatch(logout());
        }
        return Promise.reject(error);
    }

    if (!isAuthRoute(requestUrl)) {
    if (status === 403) {
        toast.error(message, {
            duration: 4000,
            position: "top-right",
        });
    } else {
        toast.error(message, {
            id: message,
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
    }

    return Promise.reject(error);
});

