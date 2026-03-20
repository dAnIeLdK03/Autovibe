
export const uploadCarImageIfPresent = async (files: File[]) => {
  const token = localStorage.getItem('token'); 

  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5258/api/cars/upload-image", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        throw new Error("Session expired. Please, try again.");
      }

      if (!response.ok) throw new Error("Unsuccessfuly upload image.");

      const data = await response.json();
      return data.url ?? data.imageUrl;
    });

    const imageUrls = (await Promise.all(uploadPromises)).filter(
      (u): u is string => typeof u === "string" && u.length > 0
    );
    return { imageUrls, error: null };
  } catch (err: any) {
    return { imageUrls: [], error: err.message };
  }
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