import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Hero from "@/components/result/hero";
import UnboxingKit from "@/components/result/unboxingKit";
import KeyFeatures from "@/components/result/keyFeatures";
import WhatItCanDo from "@/components/result/whatItCanDo";
import Warning from "@/components/result/warning";
import Charging from "@/components/result/charging";
import Compatible from "@/components/result/compatible";
import ResultCodeModal from "@/components/result/ResultCodeModal";
import ResultPageSkeleton from "@/components/result/skeleton";
import Typography from "@/components/shared/Typography";
import Button from "@/components/shared/Button";
import { useScrollPassed } from "@/hooks/useScrollPassed";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { useTestStore } from "@/stores/testStore";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";

const TOP_BAR_HEIGHT = 60;

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError, refetch } = useAssessmentResult(id ?? "");
  const nickname = useTestStore((state) => state.nickname);
  const resultCode = useTestStore((state) => state.resultCode);
  const { open, close } = useModal();
  const { open: openToast } = useToast();

  const { ref: unboxingKitStartRef, hasPassed: isPastHero } = useScrollPassed<HTMLDivElement>({
    offset: TOP_BAR_HEIGHT,
  });

  // 결과 데이터 로딩에 성공할 때마다 결과 페이지 조회를 기록한다.
  useEffect(() => {
    if (!data) return;
    trackEvent({ ...GA_EVENTS.RESULT.VIEW, label: data.overview.noun });
  }, [data]);

  // 내가 완료한 테스트의 결과 페이지일 때만, 진입 시마다 코드 복사 팝업을 띄운다.
  useEffect(() => {
    if (!data || !id || resultCode !== id) return;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(id);
      } catch {
        // 클립보드 권한이 없는 환경에서도 복사 완료 토스트는 그대로 노출
      }
      trackEvent(GA_EVENTS.RESULT.CODE_COPY);
      openToast("코드 번호가 복사되었습니다");
      close();
    };

    open({
      title: "내 결과 코드",
      contents: <ResultCodeModal code={id} />,
      confirmLabel: "내코드 복사하기",
      onConfirm: handleCopy,
    });
  }, [data, id, resultCode, open, close, openToast]);

  if (isPending) {
    return <ResultPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gray-00">
        <Typography variant="sb3" className="text-gray-06">
          결과를 불러오지 못했어요
        </Typography>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  const {
    overview,
    unboxing_kit,
    features,
    character_story,
    can_do,
    warnings,
    charging,
    compatible_friends,
  } = data;
  const heroTitle = nickname ? `${overview.noun} ${nickname}` : overview.noun;

  return (
    <div className="bg-gray-00 pb-[92px]">
      {/* ------- 상단 히어로(장난감 소개) UI ------ */}
      <Hero
        title={heroTitle}
        subtitle={overview.adjective}
        badge={overview.rarity}
        tags={overview.tags}
        imageUrl={overview.image_url}
        isTopBarDark={isPastHero}
      />
      <div ref={unboxingKitStartRef} />

      {/* ------- 언박싱 키트(성향 슬라이더) UI ------ */}
      <UnboxingKit unboxingKit={unboxing_kit} />

      {/* ------- 핵심 특징 UI ------ */}
      <KeyFeatures
        features={features}
        imageUrl={overview.image_url}
        storyTitle={character_story.title}
        storyDescription={character_story.description}
      />

      {/* ------- 이렇게 다뤄주세요 UI ------ */}
      <WhatItCanDo can_do={can_do} />

      {/* ------- 이렇게 하면 고장나요 UI ------ */}
      <Warning warnings={warnings} />

      {/* ------- 충전 방법 UI ------ */}
      <Charging charging={charging} />

      {/* ------- 친구 궁합 UI------ */}
      <Compatible compatibleFriends={compatible_friends} />
    </div>
  );
}
