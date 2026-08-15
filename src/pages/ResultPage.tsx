import Hero from "@/components/result/hero";
import UnboxingKit from "@/components/result/unboxingKit";
import KeyFeatures from "@/components/result/keyFeatures";
import WhatItCanDo from "@/components/result/whatItCanDo";
import Warning from "@/components/result/warning";
import Charging from "@/components/result/charging";
import Compatible from "@/components/result/compatible";
import { useScrollPassed } from "@/hooks/useScrollPassed";

const TOP_BAR_HEIGHT = 60;

export default function ResultPage() {
  const { ref: unboxingKitStartRef, hasPassed: isPastHero } = useScrollPassed<HTMLDivElement>({
    offset: TOP_BAR_HEIGHT,
  });

  return (
    <div className="bg-gray-00 pb-[92px]">
      {/* ------- 상단 히어로(장난감 소개) UI ------ */}
      <Hero title="팽이 지은" subtitle="새벽 2시에도 카톡 폭격하는" isTopBarDark={isPastHero} />
      <div ref={unboxingKitStartRef} />

      {/* ------- 언박싱 키트(성향 슬라이더) UI ------ */}
      <UnboxingKit />

      {/* ------- 핵심 특징 UI ------ */}
      <KeyFeatures />

      {/* ------- 이렇게 다뤄주세요 UI ------ */}
      <WhatItCanDo />

      {/* ------- 이렇게 하면 고장나요 UI ------ */}
      <Warning />

      {/* ------- 충전 방법 UI ------ */}
      <Charging />

      {/* ------- 친구 궁합 UI------ */}
      <Compatible />
    </div>
  );
}
