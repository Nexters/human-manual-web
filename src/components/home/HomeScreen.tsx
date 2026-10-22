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
  const account = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "results"],
    queryFn: getMyResults,
    enabled: Boolean(auth.data),
    retry: false,
  });
  const latest = account.data?.items[0];
  const detail = useAssessmentResult(latest?.result_code ?? code ?? "");
  const result = latest
    ? {
        code: latest.result_code,
        adjective: detail.data?.overview.adjective,
        noun: latest.noun,
        nickname: latest.nickname,
      }
    : code && detail.data
      ? {
          code,
          adjective: detail.data.overview.adjective,
          noun: detail.data.overview.noun,
          nickname: detail.data.participant.nickname,
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
        <img src={blocks} alt="" className="pakit-hero-character" />
        {result ? (
          <div className="pakit-result-heading">
            {result.adjective && <p>{result.adjective}</p>}
            <h2>{[result.noun, result.nickname].filter(Boolean).join(" ")}</h2>
          </div>
        ) : null}
        <div className="pakit-home-actions">
          <Button
            onClick={
              result ? () => navigate(`/result/${encodeURIComponent(result.code)}`) : onStart
            }
          >
            {result ? "내 결과 보기" : "테스트 시작하기"}
          </Button>
          <Button variant="outline" onClick={onCheckCompatibility}>
            친구와 케미 보기
          </Button>
          <div className="pakit-home-links">
            {result && (
              <button onClick={onStart} className="pakit-text-button">
                다시 테스트하기
              </button>
            )}
            <button
              onClick={result && !auth.data ? startKakaoLogin : onOpenMyResult}
              className="pakit-text-button"
            >
              {result && !auth.data ? "결과 보관하기" : "결과 불러오기"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
