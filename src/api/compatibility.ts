import { apiClient } from "./client";
import type { CompatibilityOutput, CompatibilityRankingOutput } from "@/types/compatibility";

export async function getCompatibility(mine: string, friend: string) {
  const { data } = await apiClient.get<CompatibilityOutput>(
    "/api/compatibility",
    { params: { mine, friend } },
  );
  return data;
}

export async function getCompatibilityRanking(resultCode: string) {
  const { data } = await apiClient.get<CompatibilityRankingOutput>(
    `/api/results/${encodeURIComponent(resultCode)}/compatibility-ranking`,
  );
  return data;
}
