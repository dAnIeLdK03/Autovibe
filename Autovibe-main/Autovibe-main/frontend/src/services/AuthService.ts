import { api } from './api';

interface LoginRequest{
    email: string;
    password: string;
};

interface RegisterRequest{
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
};

interface AuthResponse{
    token: string;
    user: {
        id: number;
        email: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    }
};

export interface User{
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export const login = async(data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("auth/login", data);
    localStorage.setItem("token", response.data.token);
    return response.data;
}

export const register = async(data: RegisterRequest): Promise<User> => {
    const response = await api.post("auth/register", data);
    return response.data;
}

export const logout = async(): Promise<void> => {
    localStorage.removeItem("token");
}

export const getCurrentUser = async(): Promise<User | null> => {
    const token = await api.get("/user");
    return token.data;
}