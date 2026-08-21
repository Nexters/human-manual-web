import { useQuery } from "@tanstack/react-query";
import { getCompletedTestCount } from "@/api/assessment";

const STALE_TIME_MS = 5 * 60 * 1000;

/**
 * 홈 화면에 보여줄 누적 참여자 수.
 *
 * 없어도 화면이 성립하는 장식성 값이라 실패하면 조용히 포기한다. 재시도로 첫 화면을
 * 붙잡아두지 않도록 retry 를 끄고, 자주 바뀌지 않으므로 한동안 다시 묻지 않는다.
 */
export function useCompletedTestCount() {
  const { data } = useQuery({
    queryKey: ["completedTestCount"],
    queryFn: getCompletedTestCount,
    staleTime: STALE_TIME_MS,
    retry: false,
  });

  return data;
}
