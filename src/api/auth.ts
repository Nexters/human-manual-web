import axios from "axios";
import { apiClient, clearLocalDevSession } from "./client";

export type AuthUser = { user_id: number; created_at: string };
export type AccountResult = {
  result_code: string;
  nickname: string;
  result_name: string;
  noun: string;
  character_id: string;
  image_url: string;
  created_at: string;
};
export type AccountCompatibility = {
  mine: AccountResult;
  friend: AccountResult;
  score: number;
  tested_at: string;
};
export const isUnauthorized = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export async function getMe(): Promise<AuthUser | null> {
  try {
    return (await apiClient.get<AuthUser>("/api/auth/me", { withCredentials: true })).data;
  } catch (error) {
    if (isUnauthorized(error)) return null;
    throw error;
  }
}
export async function logout() {
  try {
    await apiClient.post("/api/auth/logout", undefined, { withCredentials: true });
  } finally {
    clearLocalDevSession();
  }
}
export async function syncResults(resultCodes: string[]) {
  return (
    await apiClient.post<{ synced: string[]; already_synced: string[]; rejected: string[] }>(
      "/api/auth/me/results/sync",
      { result_codes: resultCodes },
      { withCredentials: true },
    )
  ).data;
}
export async function getMyResults() {
  return (
    await apiClient.get<{ total: number; items: AccountResult[] }>("/api/auth/me/results", {
      withCredentials: true,
    })
  ).data;
}
export async function getMyCompatibilities() {
  return (
    await apiClient.get<{ total: number; items: AccountCompatibility[] }>(
      "/api/auth/me/compatibilities",
      { withCredentials: true },
    )
  ).data;
}
