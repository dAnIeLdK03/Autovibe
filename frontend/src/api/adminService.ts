import { api } from './api';

export enum UserRole {
    Admin = 0,
    User = 1,
}

export interface AdminUserDto {
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


