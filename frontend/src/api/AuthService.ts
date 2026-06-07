import { api } from './api';

export interface LoginRequest{
    email: string;
    password: string;
};

export interface RegisterRequest{
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
};

interface AuthResponse{
    token: string;
    user: {
        id: number;
        email: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        /** `0` = Admin, `1` = User — same as API `Role` / `UserRole`. */
        role?: number;
    }
};

export interface User{
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    /** `0` = Admin, `1` = User — from login or `GET /user`. */
    role?: number;
}

export const login = async(data: LoginRequest): Promise<AuthResponse> => {
    localStorage.removeItem("token");
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
    const response = await api.get("/user");
    return response.data;
}


