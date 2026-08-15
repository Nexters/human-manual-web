import { apiClient } from "./client";
import type { HealthResponse } from "@/types/common";

export async function getHealth() {
  const { data } = await apiClient.get<HealthResponse>("/api/health");
  return data;
}
