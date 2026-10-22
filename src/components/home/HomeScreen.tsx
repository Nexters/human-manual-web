import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth, accountQueryKey } from "@/hooks/useAuth";
import { getMyResults } from "@/api/auth";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useMyResultStore } from "@/stores/myResultStore";
import { startKakaoLogin } from "@/lib/auth";
import blocks from "@/assets/img/splash-blocks.png";
import logo from "@/assets/img/logo.png";
import Button from "@/components/shared/Button";

export default function HomeScreen({
  participantCount,
  onStart,
  onCheckCompatibility,
  onOpenMyResult,
}: {
  participantCount?: number;
  onStart: () => void;
  onCheckCompatibility: () => void;
  onOpenMyResult: () => void;
}) {
  const navigate = useNavigate();
  const auth = useAuth();
  const code = useMyResultStore((s) => s.resultCode);
  const local = useAssessmentResult(code ?? "");
  const account = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "results"],
    queryFn: getMyResults,
    enabled: Boolean(auth.data),
    retry: false,
  });
  const latest = account.data?.items[0];
  const result = latest
    ? { code: latest.result_code, name: latest.result_name || latest.noun, image: latest.image_url }
    : code && local.data
      ? {
          code,
          name: local.data.overview.result_name || local.data.overview.noun,
          image: local.data.overview.image_url,
        }
      : null;
  return (
    <div className="pakit-home">
      <section className="pakit-hero">
        <h1>
          <img src={logo} alt="Pakit" />
        </h1>
        <p className="pakit-tagline">나를 닮은 장난감을 만나다</p>
        {participantCount !== undefined && (
          <div className="pakit-participants">
            <span />
            {participantCount.toLocaleString("ko-KR")}명이 함께했어요
          </div>
        )}
        <img
          src={blocks}
          alt=""
          className={
            participantCount === undefined ? "mx-auto mt-10 w-[272px]" : "mx-auto mt-6 w-[272px]"
          }
        />
        {result ? (
          <div className="pakit-result-heading">
            <p>{auth.data ? "가장 최근 장난감" : "이 브라우저에 보관된 장난감"}</p>
            <h2>{result.name}</h2>
          </div>
        ) : null}
        <div className="pakit-home-actions">
          <Button
            onClick={
              result ? () => navigate(`/result/${encodeURIComponent(result.code)}`) : onStart
            }
          >
            {result ? "내 결과 다시 보기" : "테스트 시작하기"}
          </Button>
          <Button variant="outline" onClick={onCheckCompatibility}>
            친구와의 케미 보기
          </Button>
          {result && (
            <button onClick={onStart} className="pakit-text-button">
              새 테스트 시작하기
            </button>
          )}
          <button
            onClick={result && !auth.data ? startKakaoLogin : onOpenMyResult}
            className="pakit-text-button"
          >
            {result && !auth.data
              ? "로그인하고 결과 보관하기"
              : "기존 결과가 있나요? 결과 불러오기"}
          </button>
        </div>
      </section>
    </div>
  );
}
