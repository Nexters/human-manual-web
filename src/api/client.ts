import axios from "axios";
import type { ErrorResponse } from "@/types/common";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data as ErrorResponse | undefined;
    console.log("[apiClient error]", data?.error?.code ?? error.message);
    return Promise.reject(error);
  },
);
