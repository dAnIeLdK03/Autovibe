import { api } from './api';
import type { CarsPageResponse } from './carsService';

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

export interface getDeletedCarsDto{
    IsDeleted: boolean | null;
    DateTime: Date | null;
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
export interface BlockUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: AdminUserDto | null;
    onSave?: () => void;
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

export const getAdminUserById = async (userId: number): Promise<AdminUserDto> => {
    const response = await api.get<AdminUserDto>(`/admin/${userId}`);
    return response.data;
};

export const getAdminUserCars = async (
    userId: number,
    pageNumber = 1,
    pageSize = 9
): Promise<CarsPageResponse> => {
    const search = new URLSearchParams();
    search.set('pageNumber', String(pageNumber));
    search.set('pageSize', String(pageSize));
    const response = await api.get<CarsPageResponse>(
        `/admin/${userId}/cars?${search.toString()}`
    );
    const data = response.data;
    if (!data || !Array.isArray(data.items)) {
        throw new Error('Unable to load cars.');
    }
    return {
        items: data.items,
        totalPages: data.totalPages ?? 0,
        pageNumber: data.pageNumber ?? pageNumber,
        pageSize: data.pageSize ?? pageSize,
    };
};

export const getDeletedCars = async (page: number, pageSize: number): Promise<CarsPageResponse> => {
    const params = new URLSearchParams();
        params.append('pageNumber', page.toString());
        params.append('pageSize', pageSize.toString());
    const response = await api.get(`/admin/deleted?${params}`);
    return response.data;
}

