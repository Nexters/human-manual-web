import { useQuery } from "@tanstack/react-query";
import { getCompatibility } from "@/api/compatibility";

/** 모달에서 미리 조회한 결과를 궁합 페이지가 그대로 쓰도록 키를 공유한다. */
export const compatibilityQueryKey = (mine: string, friend: string) =>
  ["compatibility", mine, friend] as const;

export function useCompatibility(mine: string, friend: string) {
  return useQuery({
    queryKey: compatibilityQueryKey(mine, friend),
    queryFn: () => getCompatibility(mine, friend),
    enabled: Boolean(mine) && Boolean(friend),
    // 같은 코드 조합의 궁합 결과는 바뀌지 않는다. 모달에서 미리 받아둔 값을 페이지 진입
    // 직후 다시 받지 않도록 신선한 것으로 취급한다.
    staleTime: 5 * 60 * 1000,
  });
}
