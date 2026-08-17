import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/onboarding/SplashScreen";
import { splashImages } from "@/constants/splashAssets";
import NameInputStep from "@/components/onboarding/NameInputStep";
import IntroStep from "@/components/onboarding/IntroStep";
import { introOrder, introPreloadImages, type IntroKey } from "@/components/onboarding/introSteps";
import { useImagePreload } from "@/hooks/useImagePreload";
import { useImagesReady } from "@/hooks/useImagesReady";
import { findFirstIncompleteOrder, useTestStore } from "@/stores/testStore";
import notebookBg from "@/assets/img/notebook-bg.jpg";

type Step = "splash-logo" | "splash-cta" | IntroKey | "name-input";

const onboardingPreloadImages = [...introPreloadImages, notebookBg];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const nickname = useTestStore((state) => state.nickname);
  const answers = useTestStore((state) => state.answers);
  const mbti = useTestStore((state) => state.mbti);
  const setNickname = useTestStore((state) => state.setNickname);

  const [step, setStep] = useState<Step>("splash-logo");
  const [name, setName] = useState(nickname);

  // 스플래시 자체 이미지가 다 로드될 때까지는 깨진 이미지가 보이지 않도록 렌더링을 미룬다.
  const splashReady = useImagesReady(splashImages);

  useEffect(() => {
    if (step !== "splash-logo" || !splashReady) return;
    const timer = setTimeout(() => setStep("splash-cta"), 2000);
    return () => clearTimeout(timer);
  }, [step, splashReady]);

  // 인트로/이름입력 스텝의 배경·캐릭터 이미지를 스플래시 노출 시간 동안 미리 받아둔다.
  useImagePreload(onboardingPreloadImages);

  if (!splashReady) {
    return <div className="min-h-dvh bg-white" />;
  }

  if (step === "splash-logo" || step === "splash-cta") {
    return (
      <SplashScreen
        phase={step === "splash-logo" ? "logo" : "cta"}
        onStart={() => setStep("greeting")}
      />
    );
  }

  if (step === "name-input") {
    return (
      <NameInputStep
        name={name}
        onNameChange={setName}
        onNext={() => {
          setNickname(name.trim());
          navigate(`/test/${findFirstIncompleteOrder(answers, mbti)}`);
        }}
      />
    );
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
