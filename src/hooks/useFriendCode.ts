import { useSearchParams } from "react-router-dom";
import { takeResultCode } from "@/lib/resultCode";

/**
 * URL 의 friend 쿼리파라미터에서 친구 결과 코드를 꺼낸다.
 * 뒤에 공유 문구가 붙어 넘어온 값은 앞 8자만 떼어 쓰고, 그래도 코드 형식이 아니면
 * 사용자가 내용을 알 수 없는 값이므로 에러로 알리는 대신 없는 것으로 취급한다.
 *
 * 친구 문맥은 URL 하나가 유일한 출처다. 모든 페이지 이동이 useFriendNavigate 나
 * appendFriendParam 으로 friend 를 이어붙이므로 따로 기억해둘 필요가 없다.
 */
export function useFriendCode() {
  const [searchParams] = useSearchParams();
  return takeResultCode(searchParams.get("friend"));
}
