import { api } from './api';

export const uploadImage = async(file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post("/cars/upload-image", formData, {
        headers: {
            'Content-Type': undefined,
        }
    });
    
    return typeof response.data === 'string' ? response.data : response.data.url || response.data.imageUrl || response.data;
}
