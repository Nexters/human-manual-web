import { useChemiShareModal } from "@/hooks/useChemiShareModal";
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
  const isGuest = !auth.isPending && !auth.isError && !auth.data;
  const latest = account.data?.items[0];
  const detail = useAssessmentResult(latest?.result_code ?? code ?? "");
  const result = latest
    ? {
        code: latest.result_code,
        adjective: detail.data?.overview.adjective,
        noun: latest.noun,
        nickname: latest.nickname,
        image: latest.image_url,
        name: latest.result_name || latest.noun,
      }
    : code && detail.data
      ? {
          code,
          adjective: detail.data.overview.adjective,
          noun: detail.data.overview.noun,
          nickname: detail.data.participant.nickname,
          image: detail.data.overview.image_url,
          name: detail.data.overview.result_name || detail.data.overview.noun,
        }
      : null;
  const openChemiTest = useChemiShareModal(result ?? undefined);
  return (
    <div className="pakit-home">
      <section className={`pakit-hero${result ? " pakit-hero-returning" : ""}`}>
        {!result && (
          <>
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
          </>
        )}
        {result && (
          <div className="pakit-returning-intro">
            <h1>나를 닮은 장난감을 만나다</h1>
            <p>내 성향을 알아보고, 친구와의 케미도 확인해요.</p>
          </div>
        )}
        <img
          src={result ? result.image : blocks}
          alt={result ? `${result.noun} 캐릭터` : ""}
          className="pakit-hero-character"
        />
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
          <Button variant="outline" onClick={result ? openChemiTest : onCheckCompatibility}>
            {result ? "친구와 케미 테스트" : "친구와 케미 보기"}
          </Button>
          {isGuest && result && (
            <div className="pakit-save-prompt">
              <p className="pakit-save-notice">로그인하지 않으면 결과가 사라질 수 있어요!</p>
              <button type="button" className="pakit-kakao-save" onClick={() => startKakaoLogin()}>
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.81 1.82 5.28 4.57 6.7L5.4 22l5.02-3.1c.52.07 1.05.1 1.58.1 5.52 0 10-3.58 10-8s-4.48-8-10-8Z" />
                </svg>
                카카오로 로그인하고 보관하기
              </button>
            </div>
          )}
          <div className="pakit-home-links">
            {result && (
              <button onClick={onStart} className="pakit-text-button">
                다시 테스트하기
              </button>
            )}
            {isGuest && !result ? (
              <button
                type="button"
                onClick={() => startKakaoLogin("/my/results")}
                className="pakit-text-button"
              >
                이미 테스트했다면? 로그인하고 내 보관함 보기
              </button>
            ) : !isGuest ? (
              <button type="button" onClick={onOpenMyResult} className="pakit-text-button">
                내 보관함
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
