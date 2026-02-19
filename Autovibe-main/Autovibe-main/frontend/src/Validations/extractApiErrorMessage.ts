import axios from 'axios';
import type { ApiErrorResponse } from '../services/api';

export const extractApiErrorMessage = (error: unknown): string => {
  // 1. Проверка дали е Axios грешка
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

  return "Error occured.";
};