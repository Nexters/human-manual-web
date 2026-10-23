import { apiClient } from "./client";
import { queryClient } from "@/lib/queryClient";
import type { CompatibilityOutput, CompatibilityRankingOutput } from "@/types/compatibility";

export async function getCompatibility(mine: string, friend: string) {
  const { data } = await apiClient.get<CompatibilityOutput>("/api/compatibility", {
    params: { mine, friend },
  });
  // 케미 조회가 서버에 기록되면 진열장과 계정 보관함도 최신 목록으로 갱신한다.
  void queryClient.invalidateQueries({ queryKey: ["compatibilityRanking", mine] });
  void queryClient.invalidateQueries({ queryKey: ["compatibilityRanking", friend] });
  void queryClient.invalidateQueries({
    predicate: (query) =>
      query.queryKey[0] === "account" && query.queryKey.includes("compatibilities"),
  });
  return data;
}

export async function getCompatibilityRanking(resultCode: string) {
  const { data } = await apiClient.get<CompatibilityRankingOutput>(
    `/api/results/${encodeURIComponent(resultCode)}/compatibility-ranking`,
  );
  return data;
}
