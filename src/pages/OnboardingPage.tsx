import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/onboarding/SplashScreen";
import NameInputStep from "@/components/onboarding/NameInputStep";
import IntroStep from "@/components/onboarding/IntroStep";
import { introOrder, introPreloadImages, type IntroKey } from "@/components/onboarding/introSteps";
import { useImagePreload } from "@/hooks/useImagePreload";
import notebookBg from "@/assets/img/notebook-bg.jpg";

type Step = "splash-logo" | "splash-cta" | IntroKey | "name-input";

const onboardingPreloadImages = [...introPreloadImages, notebookBg];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("splash-logo");
  const [name, setName] = useState("");

  useEffect(() => {
    if (step !== "splash-logo") return;
    const timer = setTimeout(() => setStep("splash-cta"), 2000);
    return () => clearTimeout(timer);
  }, [step]);

  // 인트로/이름입력 스텝의 배경·캐릭터 이미지를 스플래시 노출 시간 동안 미리 받아둔다.
  useImagePreload(onboardingPreloadImages);

  if (step === "splash-logo" || step === "splash-cta") {
    return (
      <SplashScreen
        phase={step === "splash-logo" ? "logo" : "cta"}
        onStart={() => setStep("greeting")}
      />
    );
  }

  if (step === "name-input") {
    return <NameInputStep name={name} onNameChange={setName} onNext={() => navigate("/question")} />;
  }

  const introIndex = introOrder.indexOf(step);

  return (
    <IntroStep
      step={step}
      onBack={() => introIndex > 0 && setStep(introOrder[introIndex - 1])}
      onNext={() => {
        if (introIndex < introOrder.length - 1) {
          setStep(introOrder[introIndex + 1]);
        } else {
          setStep("name-input");
        }
      }}
      onSkip={() => setStep("name-input")}
    />
  );
}
