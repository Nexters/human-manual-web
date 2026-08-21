import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/onboarding/SplashScreen";
import { splashImages } from "@/constants/splashAssets";
import NameInputStep from "@/components/onboarding/NameInputStep";
import IntroStep from "@/components/onboarding/IntroStep";
import PartIntroStep from "@/components/onboarding/PartIntroStep";
import TestStartModal from "@/components/onboarding/TestStartModal";
import InvitePreviewStep from "@/components/onboarding/InvitePreviewStep";
import { introOrder, introPreloadImages, type IntroKey } from "@/components/onboarding/introSteps";
import {
  questionPreloadImages,
  unboxingPreloadImages,
  resultPreloadImages,
} from "@/constants/appPreloadAssets";
import { useImagePreload } from "@/hooks/useImagePreload";
import { useImagesReady } from "@/hooks/useImagesReady";
import { useFontsReady } from "@/hooks/useFontsReady";
import { ALL_FONT_SPECS } from "@/constants/fonts";
import { useAssessmentResult } from "@/hooks/useAssessment";
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

// 이후 화면(문항, 언박싱, 결과)에서 쓰는 에셋을 첫 화면(스플래시 CTA) 노출 동안 미리 받아둔다.
// 캐릭터/결과 이미지처럼 API 응답으로 오는 값은 미리 알 수 없어 제외한다.
const firstScreenPreloadImages = [
  ...introPreloadImages,
  notebookBg,
  partIntroBg,
  characterNotebook,
  ...questionPreloadImages,
  ...unboxingPreloadImages,
  ...resultPreloadImages,
];

export default function OnboardingPage() {
  const navigate = useFriendNavigate();
  // 궁합 확인 이동은 이미 완성된 URL(입력받은 코드)을 그대로 써야 하므로,
  // URL의 friend 값을 덮어쓰는 useFriendNavigate를 거치지 않는다.
  const navigateToCompatibility = useNavigate();
  // 링크로 받은 친구 코드. 형식이 깨진 값은 없는 것으로 취급한다.
  const friendCode = useFriendCode();
  const {
    data: friendPreview,
    isPending: friendPreviewPending,
    isError: friendPreviewError,
  } = useAssessmentResult(friendCode ?? "");
  const { open, close } = useModal();

  const nickname = useTestStore((state) => state.nickname);
  const answers = useTestStore((state) => state.answers);
  const mbti = useTestStore((state) => state.mbti);
  const setNickname = useTestStore((state) => state.setNickname);
  const resetTest = useTestStore((state) => state.reset);

  const [step, setStep] = useState<Step>("splash-cta");
  const [name, setName] = useState(nickname);

  // 스플래시 자체 이미지가 다 로드될 때까지는 깨진 이미지가 보이지 않도록 렌더링을 미룬다.
  const splashReady = useImagesReady(splashImages);

  // 온보딩 첫 화면(스플래시·초대 미리보기)을 벗어날 때 히스토리 엔트리를 하나 쌓아둔다.
  // 안 그러면 URL이 계속 "/" 그대로라 브라우저 뒤로가기가 이 화면들을 거치지 않고
  // 앱 밖(친구 링크를 열어준 카톡 등)으로 바로 나가버린다.
  useEffect(() => {
    const handlePopState = () => setStep("splash-cta");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
      window.history.pushState(null, "", window.location.href);
      setStep("greeting");
    },
    [resetTest],
  );

  const openTestStartModal = useCallback(() => {
    // 친구 코드를 물고 들어왔는지에 따라 유입 경로가 다르다. 수집 데이터의 연속성을 위해
    // 1input 팝업이 쓰던 라벨을 그대로 이어 쓴다.
    const enteredWithFriendCode = friendCode !== null;

    open({
      title: "지금 바로 테스트하기",
      contents: (
        <TestStartModal
          initialFriendCode={friendCode ?? undefined}
          onStartTest={() => {
            close();
            handleStartTest(enteredWithFriendCode ? "친구초대유입" : "궁합유입");
          }}
          onCheckCompatibility={(myCode, friendCodeInput) => {
            close();
            trackEvent({
              ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
              label: enteredWithFriendCode ? "친구코드팝업_확인버튼" : "궁합팝업_케미결과확인버튼",
            });
            navigateToCompatibility(
              `/compatibility?mine=${encodeURIComponent(myCode)}&friend=${encodeURIComponent(friendCodeInput)}`,
            );
          }}
        />
      ),
    });
  }, [open, close, friendCode, handleStartTest, navigateToCompatibility]);

  useImagePreload(firstScreenPreloadImages);
  // 뒤에서 쓰는 커스텀 폰트(Waguri, ThePosterFont 등)도 첫 화면에서 미리 받아둬서,
  // 나중에 해당 화면에 처음 들어갔을 때 기본 폰트가 잠깐 보였다 바뀌는 걸 막는다.
  useFontsReady(ALL_FONT_SPECS);

  if (!splashReady) {
    return <div className="min-h-dvh bg-white" />;
  }

  // 친구 링크로 들어온 경우, 모달 대신 초대 미리보기 화면으로 바로 보낸다.
  // 친구 코드 조회가 끝나기 전에는 스플래시가 잠깐 보였다가 바뀌는 걸 막기 위해 대기한다.
  if (step === "splash-cta" && friendCode) {
    if (friendPreviewPending) {
      return <div className="min-h-dvh bg-white" />;
    }
    if (!friendPreviewError && friendPreview) {
      return (
        <InvitePreviewStep
          friendNickname={friendPreview.participant.nickname}
          friendNoun={friendPreview.overview.noun}
          friendImageUrl={friendPreview.overview.image_url}
          onStart={() => handleStartTest("친구초대유입")}
        />
      );
    }
    // 코드 조회에 실패하면(만료·잘못된 코드 등) 개인화된 화면을 보여줄 수 없으니
    // 친구 코드가 없는 사람과 같은 기본 스플래시로 보낸다.
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
