import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import SplashScreen from "@/components/onboarding/SplashScreen";
import { splashImages } from "@/constants/splashAssets";
import NameInputStep from "@/components/onboarding/NameInputStep";
import IntroStep from "@/components/onboarding/IntroStep";
import PartIntroStep from "@/components/onboarding/PartIntroStep";
import TestStartModal from "@/components/onboarding/TestStartModal";
import InvitePreviewStep from "@/components/onboarding/InvitePreviewStep";
import FriendCodeCheckModal from "@/components/onboarding/FriendCodeCheckModal";
import MyResultModal from "@/components/onboarding/MyResultModal";
import CompatibilityPageSkeleton from "@/components/compatibility/skeleton";
import { introOrder, introPreloadImages, type IntroKey } from "@/components/onboarding/introSteps";
import {
  questionPreloadImages,
  unboxingPreloadImages,
  resultPreloadImages,
  compatibilityPreloadImages,
} from "@/constants/appPreloadAssets";
import { useImagePreload } from "@/hooks/useImagePreload";
import { useImagesReady } from "@/hooks/useImagesReady";
import { useFontsReady } from "@/hooks/useFontsReady";
import { ALL_FONT_SPECS } from "@/constants/fonts";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useCompletedTestCount } from "@/hooks/useCompletedTestCount";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useFriendCode } from "@/hooks/useFriendCode";
import { useModal } from "@/hooks/useModal";
import { getCompatibility } from "@/api/compatibility";
import { compatibilityQueryKey } from "@/hooks/useCompatibility";
import { useMyResultStore } from "@/stores/myResultStore";
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
  ...compatibilityPreloadImages,
];

export default function OnboardingPage() {
  const navigate = useFriendNavigate();
  // 궁합 확인 이동은 이미 완성된 URL(입력받은 코드)을 그대로 써야 하므로,
  // URL의 friend 값을 덮어쓰는 useFriendNavigate를 거치지 않는다.
  const navigateToCompatibility = useNavigate();
  // 케미 페이지의 "테스트 시작하기" 처럼, 다른 화면에서 곧바로 테스트를 시작시키는 신호.
  // 인트로는 라우트가 아니라 이 페이지 내부 step 이라 URL 로는 가리킬 수 없다.
  const location = useLocation();
  const startTestRequested = (location.state as { startTest?: boolean } | null)?.startTest === true;
  // 링크로 받은 친구 코드. 형식이 깨진 값은 없는 것으로 취급한다.
  const friendCode = useFriendCode();
  const {
    data: friendPreview,
    isPending: friendPreviewPending,
    isError: friendPreviewError,
  } = useAssessmentResult(friendCode ?? "");
  const participantCount = useCompletedTestCount();
  const { open, close } = useModal();
  const queryClient = useQueryClient();
  // 이 브라우저에서 테스트를 마쳤는지. 친구 링크 자동 케미와 코드 자동 채우기의 근거다.
  const savedResultCode = useMyResultStore((state) => state.resultCode);

  const nickname = useTestStore((state) => state.nickname);
  const answers = useTestStore((state) => state.answers);
  const mbti = useTestStore((state) => state.mbti);
  const setNickname = useTestStore((state) => state.setNickname);
  const resetTest = useTestStore((state) => state.reset);

  const [step, setStep] = useState<Step>("splash-cta");
  const [name, setName] = useState(nickname);

  // 친구 링크로 들어왔는데 내 코드가 이미 이 브라우저에 있으면, 초대 화면을 거치지 않고
  // 둘의 케미를 바로 연다. 자기 자신과의 케미는 성립하지 않으므로 같은 코드는 제외한다.
  const canAutoChemi = Boolean(friendCode && savedResultCode && savedResultCode !== friendCode);
  const [autoChemiFailed, setAutoChemiFailed] = useState(false);
  const autoChemiTried = useRef(false);

  useEffect(() => {
    if (!canAutoChemi || autoChemiTried.current) return;
    autoChemiTried.current = true;

    const mine = savedResultCode as string;
    const friend = friendCode as string;

    void (async () => {
      try {
        // 조회가 성공한 뒤에만 넘긴다. 저장된 코드가 만료됐을 수도 있어서다.
        await queryClient.fetchQuery({
          queryKey: compatibilityQueryKey(mine, friend),
          queryFn: () => getCompatibility(mine, friend),
        });
        trackEvent({
          ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
          label: "친구링크_자동케미",
        });
        navigateToCompatibility(
          `/compatibility?mine=${encodeURIComponent(mine)}&friend=${encodeURIComponent(friend)}`,
          { replace: true },
        );
      } catch {
        // 케미를 못 만들면 초대 미리보기를 그대로 보여준다.
        setAutoChemiFailed(true);
      }
    })();
  }, [canAutoChemi, savedResultCode, friendCode, queryClient, navigateToCompatibility]);

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

  // 신호는 한 번만 소비한다. handleStartTest 가 히스토리를 쌓으므로 재실행되면 안 된다.
  const startTestConsumed = useRef(false);
  useEffect(() => {
    if (!startTestRequested || startTestConsumed.current) return;
    startTestConsumed.current = true;
    handleStartTest("궁합유입");
  }, [startTestRequested, handleStartTest]);

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

  // 친구 초대 링크로 들어온 사람이 "이미 테스트 했다면?" 을 누르면, 내 코드만 받는다.
  // 친구 코드는 URL 에 있으니, TestStartModal(코드 2개) 대신 코드 1개짜리 모달을 연다.
  // 조회·이동 흐름은 openTestStartModal 의 케미 경로와 동일하다.
  const openFriendCodeCheckModal = useCallback(() => {
    if (!friendCode) return;
    open({
      contents: (
        <FriendCodeCheckModal
          friendCode={friendCode}
          onCheckCompatibility={(myCode) => {
            close();
            trackEvent({
              ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
              label: "친구코드팝업_확인버튼",
            });
            navigateToCompatibility(
              `/compatibility?mine=${encodeURIComponent(myCode)}&friend=${encodeURIComponent(friendCode)}`,
            );
          }}
        />
      ),
    });
  }, [open, close, friendCode, navigateToCompatibility]);

  // 결과 코드가 결과지에 닿는 유일한 열쇠라, 코드를 들고 온 사람에게 입구를 열어둔다.
  // friend 문맥이 있으면 그대로 이어붙어, 결과지에서 바로 그 친구와의 케미로 갈 수 있다.
  const openMyResultModal = useCallback(() => {
    trackEvent(GA_EVENTS.ONBOARDING.MY_RESULT_OPEN);
    open({
      title: "결과지 보기",
      contents: (
        <MyResultModal
          onSubmit={(resultCode) => {
            close();
            navigate(`/result/${resultCode}`);
          }}
        />
      ),
    });
  }, [open, close, navigate]);

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
    // 자동 케미로 넘어가는 중이면 초대 화면이 잠깐 보였다 사라지는 걸 막는다.
    // 도착지가 케미 페이지이므로 그 스켈레톤을 그대로 보여준다.
    if (canAutoChemi && !autoChemiFailed) {
      return <CompatibilityPageSkeleton />;
    }
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
          onCheckExistingCode={openFriendCodeCheckModal}
          onViewFriendResult={() => navigate(`/result/${friendCode}`)}
        />
      );
    }
    // 코드 조회에 실패하면(만료·잘못된 코드 등) 개인화된 화면을 보여줄 수 없으니
    // 친구 코드가 없는 사람과 같은 기본 스플래시로 보낸다.
  }

  if (step === "splash-cta") {
    return (
      <SplashScreen
        participantCount={participantCount}
        onStart={() => handleStartTest("일반")}
        onCheckCompatibility={openTestStartModal}
        onOpenMyResult={openMyResultModal}
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
