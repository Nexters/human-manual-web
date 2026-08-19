import { useEffect, useState } from "react";
import DeliveryStep from "@/components/unboxing/DeliveryStep";
import UnboxingStep from "@/components/unboxing/UnboxingStep";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useTestStore } from "@/stores/testStore";

type Step = "delivery-loading" | "delivery-done" | "unboxing-loading" | "unboxing-done";

const DELIVERY_LOADING_DURATION_MS = 2000;
// unboxing.gif(상자가 열리는 연출)의 실제 재생 길이에 맞춰, 애니메이션이 끝까지 재생된 뒤 다음 단계로 넘어가게 한다.
const UNBOXING_LOADING_DURATION_MS = 4000;

export default function UnboxingPage() {
  const navigate = useFriendNavigate();
  const resultCode = useTestStore((state) => state.resultCode);
  const [step, setStep] = useState<Step>("delivery-loading");

  useEffect(() => {
    if (!resultCode) navigate("/", { replace: true });
  }, [resultCode, navigate]);

  useEffect(() => {
    if (step !== "delivery-loading" && step !== "unboxing-loading") return;
    const nextStep = step === "delivery-loading" ? "delivery-done" : "unboxing-done";
    const duration =
      step === "delivery-loading" ? DELIVERY_LOADING_DURATION_MS : UNBOXING_LOADING_DURATION_MS;
    const timer = setTimeout(() => setStep(nextStep), duration);
    return () => clearTimeout(timer);
  }, [step]);

  if (!resultCode) return null;

  if (step === "delivery-loading" || step === "delivery-done") {
    return (
      <DeliveryStep
        phase={step === "delivery-loading" ? "loading" : "done"}
        onConfirm={() => setStep("unboxing-loading")}
      />
    );
  }

  return (
    <UnboxingStep
      phase={step === "unboxing-loading" ? "loading" : "done"}
      onConfirm={() => navigate(`/result/${resultCode}`)}
    />
  );
}
