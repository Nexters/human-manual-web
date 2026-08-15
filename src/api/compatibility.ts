import { apiClient } from "./client";
import type { CompatibilityOutput } from "@/types/compatibility";

export async function getCompatibility(mine: string, friend: string) {
  const { data } = await apiClient.get<CompatibilityOutput>(
    "/api/compatibility",
    { params: { mine, friend } },
  );
  return data;
}
