import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useFriendCode } from "@/hooks/useFriendCode";
import { useModal } from "@/hooks/useModal";
import { findFirstIncompleteOrder, useTestStore } from "@/stores/testStore";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";
import notebookBg from "@/assets/img/notebook-bg.jpg";
import partIntroBg from "@/assets/img/part-intro-bg.jpg";
import characterNotebook from "@/assets/gif/character-notebook.gif";

type Step = "splash-cta" | IntroKey | "name-input" | "part-intro";

const onboardingPreloadImages = [...introPreloadImages, notebookBg, partIntroBg, characterNotebook];

export default function OnboardingPage() {
  const navigate = useFriendNavigate();
  // 궁합 확인 이동은 이미 완성된 URL(입력받은 코드)을 그대로 써야 하므로,
  // URL의 friend 값을 덮어쓰는 useFriendNavigate를 거치지 않는다.
  const navigateToCompatibility = useNavigate();
  const [searchParams] = useSearchParams();
  // 링크로 받은 친구 코드. 형식이 깨진 값은 없는 것으로 취급한다.
  const friendCode = useFriendCode();
  // 친구 코드를 물고 온 링크인데 코드를 건지지 못한 경우에도, 빈손으로 온 사람과 같은
  // 두 칸 입력 팝업을 띄워준다.
  const hasUnusableFriendParam = searchParams.get("friend") !== null && friendCode === null;
  const { open, close } = useModal();
  const hasAutoOpenedFriendModal = useRef(false);

  const nickname = useTestStore((state) => state.nickname);
  const answers = useTestStore((state) => state.answers);
  const mbti = useTestStore((state) => state.mbti);
  const setNickname = useTestStore((state) => state.setNickname);
  const resetTest = useTestStore((state) => state.reset);

  const [step, setStep] = useState<Step>("splash-cta");
  const [name, setName] = useState(nickname);

  // 스플래시 자체 이미지가 다 로드될 때까지는 깨진 이미지가 보이지 않도록 렌더링을 미룬다.
  const splashReady = useImagesReady(splashImages);

  // 로컬스토리지에 남아있는 이전 진행 상황을 지우고 새 테스트를 시작한다.
  const handleStartTest = useCallback(
    (entryPoint: "일반" | "친구초대유입" | "궁합유입") => {
      trackEvent({
        ...GA_EVENTS.ONBOARDING.TEST_START,
        label: `테스트시작하기_${entryPoint}`,
      });
      resetTest();
      // 이름 입력값은 마운트 때 스토어에서 한 번 받아온 로컬 state 라, 스토어만 비우면
      // 같은 브라우저에서 다시 시작할 때 이전 닉네임이 인풋에 남는다.
      setName("");
      setStep("greeting");
    },
    [resetTest],
  );

  const openTestStartModal = useCallback(() => {
    open({
      title: "지금 바로 테스트하기",
      contents: (
        <TestStartModal
          initialFriendCode={friendCode ?? undefined}
          onStartTest={() => {
            close();
            handleStartTest("궁합유입");
          }}
          onCheckCompatibility={(myCode, friendCodeInput) => {
            close();
            trackEvent({
              ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
              label: "궁합팝업_케미결과확인버튼",
            });
            navigateToCompatibility(
              `/compatibility?mine=${encodeURIComponent(myCode)}&friend=${encodeURIComponent(friendCodeInput)}`,
            );
          }}
        />
      ),
    });
  }, [open, close, friendCode, handleStartTest, navigateToCompatibility]);

  const openFriendCodeModal = useCallback(
    (code: string) => {
      open({
        title: "지금 바로 테스트하기",
        contents: (
          <FriendCodeModal
            friendCode={code}
            onStartTest={() => {
              close();
              handleStartTest("친구초대유입");
            }}
            onCheckCode={(myCode) => {
              close();
              trackEvent({
                ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
                label: "친구코드팝업_확인버튼",
              });
              navigateToCompatibility(
                `/compatibility?mine=${encodeURIComponent(myCode)}&friend=${encodeURIComponent(code)}`,
              );
            }}
          />
        ),
      });
    },
    [open, close, handleStartTest, navigateToCompatibility],
  );

  // 링크로 들어온 경우, 스플래시 CTA 화면의 페이드인이 끝난 뒤 안내 팝업을 띄운다.
  // 쓸 수 있는 친구 코드가 있으면 내 코드만 받고, 없으면 두 코드를 모두 받는다.
  useEffect(() => {
    if (step !== "splash-cta" || hasAutoOpenedFriendModal.current) return;
    if (!friendCode && !hasUnusableFriendParam) return;
    hasAutoOpenedFriendModal.current = true;

    const timer = setTimeout(() => {
      if (friendCode) openFriendCodeModal(friendCode);
      else openTestStartModal();
    }, 600);

    return () => clearTimeout(timer);
  }, [step, friendCode, hasUnusableFriendParam, openFriendCodeModal, openTestStartModal]);

  // 인트로/이름입력 스텝의 배경·캐릭터 이미지를 첫 화면(스플래시 CTA) 노출 동안 미리 받아둔다.
  useImagePreload(onboardingPreloadImages);

  if (!splashReady) {
    return <div className="min-h-dvh bg-white" />;
  }

  if (step === "splash-cta") {
    return <SplashScreen onStart={() => handleStartTest("일반")} onCheckCompatibility={openTestStartModal} />;
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
