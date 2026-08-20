import { useCallback } from "react";
import { useNavigate, useSearchParams, type NavigateOptions } from "react-router-dom";
import { appendFriendParam } from "@/lib/friendParam";

/**
 * friend 쿼리파라미터를 물고 들어온 경우, 이후 페이지 이동에도
 * 같은 friend 코드를 계속 붙여서 결과 페이지까지 이어지게 한다.
 */
export function useFriendNavigate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const friend = searchParams.get("friend");

  return useCallback(
    (to: string, options?: NavigateOptions) => navigate(appendFriendParam(to, friend), options),
    [navigate, friend],
  );
}
