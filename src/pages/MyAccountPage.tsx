import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyCompatibilities, getMyResults, isUnauthorized } from "@/api/auth";
import type { AccountResult } from "@/api/auth";
import { accountQueryKey, useAuth } from "@/hooks/useAuth";
import { startKakaoLogin } from "@/lib/auth";
import Button from "@/components/shared/Button";

function ResultPreview({ result }: { result: AccountResult }) {
  return (
    <div className="flex items-center gap-4">
      {result.image_url && (
        <img src={result.image_url} alt="" className="size-16 rounded-xl object-contain" />
      )}
      <div>
        <p className="font-bold">{result.nickname || "이름 없는 결과"}</p>
        <p className="text-sm text-gray-06">{result.result_name || result.noun}</p>
      </div>
    </div>
  );
}
export default function MyAccountPage({ kind }: { kind: "results" | "compatibilities" }) {
  const auth = useAuth();
  const results = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "results"],
    queryFn: getMyResults,
    enabled: Boolean(auth.data) && kind === "results",
    retry: false,
  });
  const compatibilities = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "compatibilities"],
    queryFn: getMyCompatibilities,
    enabled: Boolean(auth.data) && kind === "compatibilities",
    retry: false,
  });
  const query = kind === "results" ? results : compatibilities;
  const loginRequired =
    (!auth.isPending && !auth.isError && !auth.data) || isUnauthorized(query.error);
  return (
    <section className="px-5 py-7 text-gray-09">
      <Link className="text-sm text-gray-06" to="/">
        홈으로
      </Link>
      <h1 className="my-6 text-2xl font-bold">{kind === "results" ? "내 결과" : "내 궁합"}</h1>
      {loginRequired ? (
        <div className="flex flex-col gap-5">
          <p>로그인하면 계정에 연결된 {kind === "results" ? "결과를" : "궁합을"} 볼 수 있어요.</p>
          <Button onClick={startKakaoLogin}>카카오로 로그인</Button>
          <p className="text-sm text-gray-06">로그인 없이도 홈에서 결과 코드로 조회할 수 있어요.</p>
        </div>
      ) : auth.isError || query.isError ? (
        <div className="flex flex-col gap-4">
          <p>목록을 불러오지 못했어요.</p>
          <Button onClick={() => void (auth.isError ? auth.refetch() : query.refetch())}>
            다시 시도
          </Button>
        </div>
      ) : auth.isPending || query.isPending ? (
        <p role="status">불러오는 중이에요.</p>
      ) : query.data?.items.length === 0 ? (
        <p>아직 계정에 연결된 {kind === "results" ? "결과가" : "궁합이"} 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {kind === "results"
            ? results.data?.items.map((result) => (
                <li key={result.result_code}>
                  <Link
                    className="block rounded-2xl border border-gray-02 p-4"
                    to={`/result/${encodeURIComponent(result.result_code)}`}
                  >
                    <ResultPreview result={result} />
                    <p className="mt-3 text-xs text-gray-06">
                      {new Date(result.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </Link>
                </li>
              ))
            : compatibilities.data?.items.map((item, index) => (
                <li
                  key={`${item.mine.result_code}-${item.friend.result_code}-${item.tested_at}-${index}`}
                >
                  <Link
                    className="flex flex-col gap-3 rounded-2xl border border-gray-02 p-4"
                    to={`/compatibility?mine=${encodeURIComponent(item.mine.result_code)}&friend=${encodeURIComponent(item.friend.result_code)}`}
                  >
                    <ResultPreview result={item.mine} />
                    <ResultPreview result={item.friend} />
                    <p className="font-bold">궁합 {item.score}점</p>
                    <p className="text-xs text-gray-06">
                      {new Date(item.tested_at).toLocaleDateString("ko-KR")}
                    </p>
                  </Link>
                </li>
              ))}
        </ul>
      )}
    </section>
  );
}
