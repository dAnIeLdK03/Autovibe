import { api } from './api';

export interface ImageFile {
  uri: string;
  name: string;
  type: string;
}

export const uploadImage = async (file: ImageFile): Promise<string> => {
    const formData = new FormData();

    formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
    } as any);

    const response = await api.post("/cars/upload-image", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });

    return typeof response.data === 'string' 
        ? response.data 
        : response.data.url || response.data.imageUrl || response.data;
}