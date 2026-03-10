import axios from 'axios';
import type { ApiErrorResponse } from '../services/api';

export const extractApiErrorMessage = (error: any): string => {
  const data = error.response?.data;

  if(data?.errors){
    const allErrors = Object.values(data.errors).flat();
    return allErrors.join(" ");
  }

  if(typeof data === 'string') return data;
  if(data?.message) return data.message;

  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse;
    
    if (apiError?.message) {
      return apiError.message;
    }

    return error.message || "Network error occured.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return error.message || "Error occured.";
};