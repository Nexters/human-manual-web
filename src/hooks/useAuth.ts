import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/auth";

export const authQueryKey = ["auth", "me"] as const;
export const accountQueryKey = ["account"] as const;
export function useAuth() {
  return useQuery({ queryKey: authQueryKey, queryFn: getMe, retry: false, staleTime: 60_000 });
}
