import { api } from './api';

export interface EditUserModalProps{
   isOpen: boolean;
   onClose: () => void;
   user: UserData | null;
   onSave?: (data: UserData) => void;
}

export interface UserData{
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export const deleteUser = async(id: number): Promise<void> => {
    await api.delete(`/user/${id}`);
}

export const updateUser = async(id: number, data: UserData): Promise<UserData> => {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
}