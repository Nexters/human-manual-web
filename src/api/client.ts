import axios from "axios";
import type { ErrorResponse } from "@/types/common";

const LOCAL_DEV_SESSION_STORAGE_KEY = "pakit-local-dev-session";
const LOCAL_DEV_SESSION_FRAGMENT_KEY = "pakit_dev_session";
const isLocalDevBrowser =
  import.meta.env.DEV &&
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

function captureLocalDevSession(): void {
  if (!isLocalDevBrowser || !window.location.hash) return;

  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const token = fragment.get(LOCAL_DEV_SESSION_FRAGMENT_KEY);
  if (!token) return;

  window.sessionStorage.setItem(LOCAL_DEV_SESSION_STORAGE_KEY, token);
  fragment.delete(LOCAL_DEV_SESSION_FRAGMENT_KEY);
  const nextHash = fragment.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}${nextHash ? `#${nextHash}` : ""}`,
  );
}

captureLocalDevSession();

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.pakit.kr",
  timeout: 10_000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (isLocalDevBrowser) {
    const token = window.sessionStorage.getItem(LOCAL_DEV_SESSION_STORAGE_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data as ErrorResponse | undefined;
    console.log("[apiClient error]", data?.error?.code ?? error.message);
    return Promise.reject(error);
  },
);

export function clearLocalDevSession(): void {
  if (isLocalDevBrowser) {
    window.sessionStorage.removeItem(LOCAL_DEV_SESSION_STORAGE_KEY);
  }
}
