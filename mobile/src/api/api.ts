import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { extractApiErrorMessage } from "../shared/extractErrorMessage/extractApiErrorMessage";
import { navigateRef } from "../navigation/navigateRef";
import Toast from "react-native-toast-message";
import { store } from "../stores/store";
import { logout as logoutAction } from "../stores/authSlice";

export const API_ORIGIN = process.env.EXPO_PUBLIC_API_URL;
if (!API_ORIGIN?.trim()) {
  throw new Error("EXPO_PUBLIC_API_URL is not set");
}

const BASE_URL = `${API_ORIGIN.replace(/\/+$/, "")}/api`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  details?: string;
}

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message = extractApiErrorMessage(error);
    const status = error.response?.status;

    if (status === 401) {
      await AsyncStorage.removeItem("token");
      store.dispatch(logoutAction());
      if (navigateRef.isReady()) {
        navigateRef.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
      return Promise.reject(error);
    }

    if (!error.response) {
      const originHint = API_ORIGIN?.trim()
        ? `API: ${API_ORIGIN}`
        : "API URL is missing";
      Toast.show({
        type: "error",
        text1: "Network error",
        text2: `${message} (${originHint})`,
        position: "top",
        visibilityTime: 6000,
      });
      return Promise.reject(error);
    }

    if (status === 403) {
      Toast.show({
        type: "error",
        text1: "You are not allowed to perform this action.",
        position: "top",
        visibilityTime: 4000,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
        visibilityTime: 5000,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
