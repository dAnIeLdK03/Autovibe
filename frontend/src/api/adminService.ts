import { api } from './api';
import type { UserData } from './userService';

export enum UserRole {
    Admin = 0,
    User = 1,
}

export interface AdminUserDto{
    id: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    role: UserRole;
    isBlocked?: boolean | null;
    blockedUntil?: string | null;
    blockReason?: string | null;
}

export interface UpdateAdminUserStatus {
    isBlocked?: boolean | null;
    blockedUntil?: string | null;
    blockReason?: string | null;
}

export interface AdminUsersPageResponse {
    items: AdminUserDto[];
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    totalItems: number;
}

export interface GetAdminUsersParams {
    pageNumber?: number;
    pageSize?: number;
    email?: string;
}

export interface AdminUserFilters{
    email?: string;
}

export const getAdminUsers = async (
    params: GetAdminUsersParams = {}
): Promise<AdminUsersPageResponse> => {
    const pageNumber = params.pageNumber ?? 1;
    const pageSize = params.pageSize ?? 18;

    const search = new URLSearchParams();
    search.set('pageNumber', String(pageNumber));
    search.set('pageSize', String(pageSize));
    if (params.email?.trim()) {
        search.set('email', params.email.trim());
    }

    const response = await api.get<AdminUsersPageResponse>(`/admin?${search.toString()}`);
    return response.data;
};

export interface UpdateUserStatusAdminResponse {
    message: string;
    userId: number;
    isBlocked: boolean;
};

export interface UpdateAdminUserRoleBody {
    role: UserRole;
}

export interface UpdateAdminUserRoleResponse {
    id: number;
    newRole: string;
    message: string;
}


export const updateUserStatusAdmin = async (
    userId: number,
    data: UpdateAdminUserStatus
): Promise<UpdateUserStatusAdminResponse> => {
    const response = await api.patch<UpdateUserStatusAdminResponse>(
        `/admin/${userId}/status`,
        data
    );
    return response.data;
};

export const updateUserRoleAdmin = async (
    userId: number,
    body: UpdateAdminUserRoleBody
): Promise<UpdateAdminUserRoleResponse> => {
    const response = await api.patch<UpdateAdminUserRoleResponse>(
        `/admin/${userId}/role`,
        body
    );
    return response.data;
};

export const hardDeleteCarAdmin = async (carId: number): Promise<void> => {
    await api.delete(`/admin/${carId}`);
};

export const restoreCarAdmin = async (carId: number): Promise<boolean> => {
    const response = await api.patch(`/admin/${carId}/restore`);
    return response.data;
};

export const getUser = async(): Promise<UserData> => {
    const response = await api.get(`/user`);
    return response.data;
}


