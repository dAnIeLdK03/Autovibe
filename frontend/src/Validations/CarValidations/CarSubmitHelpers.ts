import axios from "axios";
import { uploadImage } from "../../services/imageService";

interface BackendErrorData {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export const uploadCarImageIfPresent = async (files: File[]) => {
  try {
    const uplodadedPromises = files.map(async (file) => {
      return await uploadImage(file)
    });

    const results = await Promise.all(uplodadedPromises);

    const imageUrls = results.filter(
      (u): u is string => typeof u === "string" && u.length > 0
    );

    return {imageUrls, error: null};

  } catch (err: unknown) {
      const errorMessage = extractApiErrorMessage(err, "Unsuccessfully uploaded image.");
        return {imageUrls: [], error: errorMessage};
  }
};
//"http://localhost:5258/api/cars/upload-image"


export const extractApiErrorMessage = (error: unknown, fallback: string): string => {
  let errorMessage = fallback;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as BackendErrorData | undefined;

    if (data) {
      if (typeof data === 'object' && data.errors) {
        const allErrors = Object.values(data.errors).flat();
        return allErrors.length > 0 ? allErrors.join(', ') : fallback;
      }

      if (data.message) {
        return data.message;
      }
      
      if (typeof data === 'string') {
        return data;
      }

      const errors: string[] = [];
      for (const key in data) {
        const value = data[key];
        if (Array.isArray(value)) {
          errors.push(...value.map(String));
        } else if (typeof value === 'string' && key !== 'message') {
          errors.push(value);
        }
      }
      return errors.length > 0 ? errors.join(', ') : JSON.stringify(data);
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
};