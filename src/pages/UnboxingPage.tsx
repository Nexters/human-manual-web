import { useEffect, useMemo, useState } from "react";
import DeliveryStep from "@/components/unboxing/DeliveryStep";
import UnboxingStep from "@/components/unboxing/UnboxingStep";
import {
  getClosedBoxAsset,
  getClosedBoxDurationMs,
  getOpenBoxAsset,
} from "@/components/unboxing/unboxingAssets";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useImagePreload } from "@/hooks/useImagePreload";
import { useTestStore } from "@/stores/testStore";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";

type Step = "delivery-loading" | "delivery-done" | "unboxing-loading" | "unboxing-done";

const DELIVERY_LOADING_DURATION_MS = 2000;

export default function UnboxingPage() {
  const navigate = useFriendNavigate();
  const resultCode = useTestStore((state) => state.resultCode);
  const [step, setStep] = useState<Step>("delivery-loading");
  // 배송/언박싱 연출 중 조합별 상자·도구 에셋을 고르기 위해 결과를 미리 조회해둔다.
  // ResultPage에서 같은 쿼리 키로 다시 조회할 때 캐시를 그대로 재사용한다.
  const { data } = useAssessmentResult(resultCode ?? "");
  const packagingType = data?.unboxing_kit.packaging.type;
  const openingToolType = data?.unboxing_kit.opening_tool.type;

  // 조합이 정해지는 즉시(배송 연출 중) 이 사람의 gif·이미지만 미리 받아둔다.
  // 16개 조합을 다 받으면 트래픽이 너무 커서, 실제로 보게 될 1쌍만 고른다.
  const comboPreloadImages = useMemo(() => {
    if (!packagingType || !openingToolType) return [];
    const closed = getClosedBoxAsset(packagingType, openingToolType);
    const open = getOpenBoxAsset(packagingType, openingToolType);
    return open ? [closed, open] : [closed];
  }, [packagingType, openingToolType]);
  useImagePreload(comboPreloadImages);

  useEffect(() => {
    if (!resultCode) navigate("/", { replace: true });
  }, [resultCode, navigate]);

  useEffect(() => {
    if (step !== "delivery-loading") return;
    const timer = setTimeout(() => setStep("delivery-done"), DELIVERY_LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step !== "unboxing-loading") return;
    // 조합별 gif마다 실제 재생 길이가 달라, 고정 대기 시간 동안 짧은 gif가 두 번 재생되는 문제를 막기 위해
    // 미리 계산해둔 gif 실제 재생 길이만큼만 대기한다(값은 unboxingAssets.ts에 하드코딩).
    const duration = getClosedBoxDurationMs(packagingType, openingToolType);
    const timer = setTimeout(() => setStep("unboxing-done"), duration);
    return () => clearTimeout(timer);
  }, [step, packagingType, openingToolType]);

  if (!resultCode) return null;

  if (step === "delivery-loading" || step === "delivery-done") {
    return (
      <DeliveryStep
        phase={step === "delivery-loading" ? "loading" : "done"}
        onConfirm={() => {
          trackEvent(GA_EVENTS.UNBOXING.DELIVERY_CONFIRM);
          setStep("unboxing-loading");
        }}
      />
    );
  }

  return (
    <UnboxingStep
      phase={step === "unboxing-loading" ? "loading" : "done"}
      packagingType={packagingType}
      openingToolType={openingToolType}
      onConfirm={() => {
        trackEvent(GA_EVENTS.UNBOXING.OPEN_CONFIRM);
        navigate(`/result/${resultCode}`);
      }}
    />
  );
}
