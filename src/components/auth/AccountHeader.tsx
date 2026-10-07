import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { accountQueryKey, authQueryKey, useAuth } from "@/hooks/useAuth";
import { startKakaoLogin } from "@/lib/auth";
import { useToast } from "@/hooks/useToast";

export default function AccountHeader() {
  const auth = useAuth();
  const client = useQueryClient();
  const toast = useToast();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await client.cancelQueries({ queryKey: authQueryKey });
      await client.cancelQueries({ queryKey: accountQueryKey });
      client.setQueryData(authQueryKey, null);
      client.removeQueries({ queryKey: accountQueryKey });
    },
    onError: () => toast.open("로그아웃하지 못했어요. 다시 시도해 주세요."),
  });
  return (
    <header className="flex min-h-[52px] items-center justify-between gap-2 border-b border-gray-02 bg-white px-5 text-sm text-gray-09">
      <nav className="flex gap-4" aria-label="내 계정">
        <Link className="py-3" to="/my/results">
          내 결과
        </Link>
        <Link className="py-3" to="/my/compatibilities">
          내 궁합
        </Link>
      </nav>
      {auth.isPending ? (
        <span>확인 중</span>
      ) : auth.data ? (
        <button className="py-3" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "로그아웃 중" : "로그아웃"}
        </button>
      ) : auth.isError ? (
        <button className="py-3" onClick={() => void auth.refetch()}>
          로그인 상태 재확인
        </button>
      ) : (
        <button
          className="rounded-full bg-[#FEE500] px-3 py-2 text-[#191919]"
          onClick={startKakaoLogin}
        >
          카카오 로그인
        </button>
      )}
    </header>
  );
}
