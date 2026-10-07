import { useEffect, useState } from "react";
import { getMe, syncResults } from "@/api/auth";
import { collectLocalResultCodes, consumeReturnTo, startKakaoLogin } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { accountQueryKey, authQueryKey } from "@/hooks/useAuth";
import Button from "@/components/shared/Button";

// StrictMode의 effect 재실행에서도 동기화와 복귀를 한 번만 수행한다.
let completion: Promise<void> | null = null;
function completeLogin() {
  return (completion ??= (async () => {
    const user = await getMe();
    if (!user) throw new Error("로그인을 확인하지 못했어요.");
    await queryClient.cancelQueries({ queryKey: authQueryKey });
    queryClient.setQueryData(authQueryKey, user);
    const codes = collectLocalResultCodes();
    if (codes.length) {
      try {
        await syncResults(codes);
      } catch {
        /* 동기화 실패는 로그인 성공과 별개다. 로컬 결과는 유지한다. */
      }
    }
    await queryClient.cancelQueries({ queryKey: accountQueryKey });
    queryClient.removeQueries({ queryKey: accountQueryKey });
    window.location.replace(consumeReturnTo());
  })().catch((error) => {
    completion = null;
    throw error;
  }));
}
export default function AuthCompletePage() {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    completeLogin().catch(() => {
      if (active) setFailed(true);
    });
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-5 text-center">
      <p>
        {failed
          ? "로그인을 확인하지 못했어요. 다시 로그인해 주세요."
          : "로그인을 확인하고 결과를 연결하고 있어요."}
      </p>
      {failed && (
        <>
          <Button onClick={startKakaoLogin}>카카오로 다시 로그인</Button>
          <a href="/">홈으로</a>
        </>
      )}
    </div>
  );
}
