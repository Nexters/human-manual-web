import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SplashScreen from "@/components/onboarding/SplashScreen";
import { splashImages } from "@/constants/splashAssets";
import NameInputStep from "@/components/onboarding/NameInputStep";
import IntroStep from "@/components/onboarding/IntroStep";
import PartIntroStep from "@/components/onboarding/PartIntroStep";
import FriendCodeModal from "@/components/onboarding/FriendCodeModal";
import TestStartModal from "@/components/onboarding/TestStartModal";
import { introOrder, introPreloadImages, type IntroKey } from "@/components/onboarding/introSteps";
import { useImagePreload } from "@/hooks/useImagePreload";
import { useImagesReady } from "@/hooks/useImagesReady";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useModal } from "@/hooks/useModal";
import { findFirstIncompleteOrder, useTestStore } from "@/stores/testStore";
import notebookBg from "@/assets/img/notebook-bg.jpg";
import partIntroBg from "@/assets/img/part-intro-bg.jpg";
import characterNotebook from "@/assets/gif/character-notebook.gif";

type Step = "splash-logo" | "splash-cta" | IntroKey | "name-input" | "part-intro";

const onboardingPreloadImages = [...introPreloadImages, notebookBg, partIntroBg, characterNotebook];

export default function OnboardingPage() {
  const navigate = useFriendNavigate();
  const [searchParams] = useSearchParams();
  const friendCode = searchParams.get("friend");
  const { open, close } = useModal();
  const hasAutoOpenedFriendModal = useRef(false);

  const nickname = useTestStore((state) => state.nickname);
  const answers = useTestStore((state) => state.answers);
  const mbti = useTestStore((state) => state.mbti);
  const setNickname = useTestStore((state) => state.setNickname);
  const resetTest = useTestStore((state) => state.reset);

  const [step, setStep] = useState<Step>("splash-logo");
  const [name, setName] = useState(nickname);

  // 스플래시 자체 이미지가 다 로드될 때까지는 깨진 이미지가 보이지 않도록 렌더링을 미룬다.
  const splashReady = useImagesReady(splashImages);

  // 로컬스토리지에 남아있는 이전 진행 상황을 지우고 새 테스트를 시작한다.
  const handleStartTest = useCallback(() => {
    resetTest();
    setStep("greeting");
  }, [resetTest]);

  useEffect(() => {
    if (step !== "splash-logo" || !splashReady) return;
    const timer = setTimeout(() => setStep("splash-cta"), 2000);
    return () => clearTimeout(timer);
  }, [step, splashReady]);

  // 친구 코드를 물고 들어온 경우, 스플래시 CTA 화면의 페이드인이 끝난 뒤 안내 팝업을 띄운다.
  useEffect(() => {
    if (step !== "splash-cta" || !friendCode || hasAutoOpenedFriendModal.current) return;
    hasAutoOpenedFriendModal.current = true;

    const timer = setTimeout(() => {
      open({
        title: "지금 바로 테스트하기",
        contents: (
          <FriendCodeModal
            onStartTest={() => {
              close();
              handleStartTest();
            }}
            onCheckCode={(myCode) => {
              close();
              navigate(
                `/compatibility?mine=${encodeURIComponent(myCode)}&friend=${encodeURIComponent(friendCode)}`,
              );
            }}
          />
        ),
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [step, friendCode, open, close, navigate, handleStartTest]);

  // 인트로/이름입력 스텝의 배경·캐릭터 이미지를 스플래시 노출 시간 동안 미리 받아둔다.
  useImagePreload(onboardingPreloadImages);

  const openTestStartModal = () => {
    open({
      title: "지금 바로 테스트하기",
      contents: (
        <TestStartModal
          initialFriendCode={friendCode ?? undefined}
          onStartTest={() => {
            close();
            handleStartTest();
          }}
          onCheckCompatibility={(myCode, friendCodeInput) => {
            close();
            navigate(
              `/compatibility?mine=${encodeURIComponent(myCode)}&friend=${encodeURIComponent(friendCodeInput)}`,
            );
          }}
        />
      ),
    });
  };

  if (!splashReady) {
    return <div className="min-h-dvh bg-white" />;
  }

  if (step === "splash-logo" || step === "splash-cta") {
    return (
      <SplashScreen
        phase={step === "splash-logo" ? "logo" : "cta"}
        onStart={handleStartTest}
        onCheckCompatibility={openTestStartModal}
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
          setStep("part-intro");
        }}
      />
    );
  }

  if (step === "part-intro") {
    return (
      <PartIntroStep
        onBack={() => setStep("name-input")}
        onNext={() => navigate(`/test/${findFirstIncompleteOrder(answers, mbti)}`)}
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
