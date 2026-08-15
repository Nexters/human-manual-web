import { useQuery } from "@tanstack/react-query";
import { getCompatibility } from "@/api/compatibility";

export function useCompatibility(mine: string, friend: string) {
  return useQuery({
    queryKey: ["compatibility", mine, friend],
    queryFn: () => getCompatibility(mine, friend),
    enabled: Boolean(mine) && Boolean(friend),
  });
}
