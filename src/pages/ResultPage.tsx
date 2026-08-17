import { useParams } from "react-router-dom";
import Hero from "@/components/result/hero";
import UnboxingKit from "@/components/result/unboxingKit";
import KeyFeatures from "@/components/result/keyFeatures";
import WhatItCanDo from "@/components/result/whatItCanDo";
import Warning from "@/components/result/warning";
import Charging from "@/components/result/charging";
import Compatible from "@/components/result/compatible";
import Typography from "@/components/shared/Typography";
import Button from "@/components/shared/Button";
import { useScrollPassed } from "@/hooks/useScrollPassed";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useTestStore } from "@/stores/testStore";

const TOP_BAR_HEIGHT = 60;

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError, refetch } = useAssessmentResult(id ?? "");
  const nickname = useTestStore((state) => state.nickname);

  const { ref: unboxingKitStartRef, hasPassed: isPastHero } = useScrollPassed<HTMLDivElement>({
    offset: TOP_BAR_HEIGHT,
  });

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-00">
        <Typography variant="sb3" className="text-gray-06">
          불러오는 중...
        </Typography>
      </div>
    );
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

  const { overview, unboxing_kit, features, can_do, warnings, charging } = data;
  const heroTitle = nickname ? `${overview.noun} ${nickname}` : overview.noun;

  return (
    <div className="bg-gray-00 pb-[92px]">
      {/* ------- 상단 히어로(장난감 소개) UI ------ */}
      <Hero
        title={heroTitle}
        subtitle={overview.adjective}
        badge={overview.rarity}
        tags={overview.tags}
        characterId={overview.character_id}
        isTopBarDark={isPastHero}
      />
      <div ref={unboxingKitStartRef} />

      {/* ------- 언박싱 키트(성향 슬라이더) UI ------ */}
      <UnboxingKit unboxingKit={unboxing_kit} />

      {/* ------- 핵심 특징 UI ------ */}
      <KeyFeatures
        features={features}
        characterId={overview.character_id}
        title={unboxing_kit.title}
        description={unboxing_kit.description}
      />

      {/* ------- 이렇게 다뤄주세요 UI ------ */}
      <WhatItCanDo can_do={can_do} />

      {/* ------- 이렇게 하면 고장나요 UI ------ */}
      <Warning warnings={warnings} />

      {/* ------- 충전 방법 UI ------ */}
      <Charging charging={charging} />

      {/* ------- 친구 궁합 UI------ */}
      <Compatible />
    </div>
  );
}
