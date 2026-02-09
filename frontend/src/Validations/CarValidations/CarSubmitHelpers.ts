import { uploadImage } from '../../services/imageService';

export const uploadCarImageIfPresent = async (
  imageFile: File | null
): Promise<{ imageUrls: string[] | undefined; error: string | null }> => {
  if (!imageFile) {
    return { imageUrls: undefined, error: null };
  }
  try {
    const imageUrl = await uploadImage(imageFile);
    return { imageUrls: [imageUrl], error: null };
  } catch {
    return { imageUrls: undefined, error: 'Unable to upload image.' };
  }
};

export const validateCarOwner = (
  carSellerId: number,
  userId: number | undefined
): string | null => {
  if (carSellerId !== userId) {
    return 'You are not the owner of this car.';
  }
  return null;
};

export const extractApiErrorMessage = (error: any, fallback: string) : string => {
  let errorMessage = fallback;
  

  if (error?.response?.data) {
    const data = error.response.data;

    if (typeof data === 'object' && !data.message) {
      const errors: string[] = [];
      for (const key in data) {
        if (Array.isArray(data[key])) {
          errors.push(...data[key]);
        } else if (typeof data[key] === 'string') {
          errors.push(data[key]);
        }
      }
      errorMessage = errors.length > 0 ? errors.join(', ') : JSON.stringify(data);
    } else {
      errorMessage = data.message || data || fallback;
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }

  return errorMessage;
}