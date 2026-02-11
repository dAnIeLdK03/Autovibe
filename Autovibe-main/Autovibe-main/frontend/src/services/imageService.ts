import { api } from './api';

export const uploadImage = async(file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    // For FormData, the browser automatically sets the correct Content-Type header with boundary,
    // so we should not set it manually. Setting it to undefined allows the browser to handle it.
    const response = await api.post("/cars/upload-image", formData, {
        headers: {
            'Content-Type': undefined, // Remove the global JSON header
        }
    });
    
    // If the backend returns an object with a url, use response.data.url or response.data.imageUrl
    // If it returns a direct string, use response.data
    return typeof response.data === 'string' ? response.data : response.data.url || response.data.imageUrl || response.data;
}
