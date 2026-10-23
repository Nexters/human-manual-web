import { useQuery } from "@tanstack/react-query";
import { getMyResults } from "@/api/auth";
import { accountQueryKey, useAuth } from "@/hooks/useAuth";
import { useMyResultStore } from "@/stores/myResultStore";

/** 계정의 대표 결과를 우선한다. 비회원만 브라우저에 저장된 결과를 사용한다. */
export function usePrimaryResult() {
  const auth = useAuth();
  const localCode = useMyResultStore((state) => state.resultCode);
  const account = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "results"],
    queryFn: getMyResults,
    enabled: Boolean(auth.data),
    retry: false,
  });
  return {
    account,
    result: account.data?.items[0],
    code: auth.data
      ? (account.data?.items[0]?.result_code ?? null)
      : !auth.isPending && !auth.isError
        ? localCode
        : null,
    isPending: auth.isPending || (Boolean(auth.data) && account.isPending),
  };
}
