import { uploadImage } from "../../services/imageService";

export const uploadCarImageIfPresent = async (files: File[]) => {
  try {
    const uplodaPromises = files.map(async (file) => {
      return await uploadImage(file)
    });

    const results = await Promise.all(uplodaPromises);

    const imageUrls = results.filter(
      (u): u is string => typeof u === "string" && u.length > 0
    );

    return {imageUrls, error: null};

  } catch (err: any) {
    const errorMessage = err.response?.status === 401 
        ? "Session expired. Please, try again." 
        : "Unsuccessfully uploaded image.";

        return {imageUrls: [], error: errorMessage};
  }
};
//"http://localhost:5258/api/cars/upload-image"


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