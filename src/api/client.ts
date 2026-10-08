import axios from "axios";
import type { ErrorResponse } from "@/types/common";

export const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8001" : "https://api.pakit.kr");

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  timeout: 10_000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data as ErrorResponse | undefined;
    console.log("[apiClient error]", data?.error?.code ?? error.message);
    return Promise.reject(error);
  },
);
