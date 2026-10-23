import { useChemiShareModal } from "@/hooks/useChemiShareModal";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth, accountQueryKey } from "@/hooks/useAuth";
import { getMyResults } from "@/api/auth";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useMyResultStore } from "@/stores/myResultStore";
import { startKakaoLogin } from "@/lib/auth";
import blocks from "@/assets/img/splash-blocks.png";
import logo from "@/assets/img/logo.png";
import Button from "@/components/shared/Button";
import ShareNodesIcon from "@/components/shared/icons/ShareNodesIcon";

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
        {result ? (
          <Link
            to={`/result/${encodeURIComponent(result.code)}`}
            className="pakit-character-display"
            aria-label={`${result.noun} ${result.nickname} 내 결과 자세히 보기`}
          >
            <img
              src={result.image}
              alt={`${result.noun} 캐릭터`}
              className="pakit-hero-character"
            />
            <div className="pakit-result-heading">
              {result.adjective && <p>{result.adjective}</p>}
              <h2>{[result.noun, result.nickname].filter(Boolean).join(" ")}</h2>
            </div>
            <span className="pakit-result-link">
              내 결과 자세히 보기 <span aria-hidden="true">→</span>
            </span>
          </Link>
        ) : (
          <img src={blocks} alt="" className="pakit-hero-character" />
        )}
        <div className="pakit-home-actions">
          {result ? (
            <div className="pakit-chemi-invite">
              <Button className="w-full" onClick={openChemiTest}>
                <span className="inline-flex items-center gap-2">
                  <ShareNodesIcon aria-hidden="true" className="size-5 shrink-0" />
                  친구와 케미 테스트
                </span>
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={onStart}>테스트 시작하기</Button>
              <Button variant="outline" onClick={onCheckCompatibility}>
                친구와 케미 보기
              </Button>
            </>
          )}
          {isGuest && (
            <div className="pakit-save-prompt">
              <button
                type="button"
                className="pakit-kakao-save"
                onClick={() => startKakaoLogin("/my/results")}
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.81 1.82 5.28 4.57 6.7L5.4 22l5.02-3.1c.52.07 1.05.1 1.58.1 5.52 0 10-3.58 10-8s-4.48-8-10-8Z" />
                </svg>
                카카오 로그인하고 보관하기
              </button>
              <p className="pakit-save-notice">로그인하지 않으면 결과가 사라질 수 있어요!</p>
            </div>
          )}
          <div className="pakit-home-links">
            {result && (
              <button onClick={onStart} className="pakit-text-button">
                다시 테스트하기
              </button>
            )}
            {auth.data && (
              <button type="button" onClick={onOpenMyResult} className="pakit-text-button">
                내 보관함
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
