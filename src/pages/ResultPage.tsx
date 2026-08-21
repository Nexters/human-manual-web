import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Hero from "@/components/result/hero";
import UnboxingKit from "@/components/result/unboxingKit";
import KeyFeatures from "@/components/result/keyFeatures";
import WhatItCanDo from "@/components/result/whatItCanDo";
import Warning from "@/components/result/warning";
import Charging from "@/components/result/charging";
import Compatible from "@/components/result/compatible";
import ShareResult from "@/components/result/shareResult";
import FriendChemiTestModal from "@/components/result/FriendChemiTestModal";
import ResultPageSkeleton from "@/components/result/skeleton";
import ScrollButtons from "@/components/result/ScrollButtons";
import Typography from "@/components/shared/Typography";
import Button from "@/components/shared/Button";
import Spinner from "@/components/shared/Spinner";
import { useScrollPassed } from "@/hooks/useScrollPassed";
import { useIsVisible } from "@/hooks/useIsVisible";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { getCompatibility } from "@/api/compatibility";
import { compatibilityQueryKey } from "@/hooks/useCompatibility";
import { useFriendCode } from "@/hooks/useFriendCode";
import { useFriendStore } from "@/stores/friendStore";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { useTestStore } from "@/stores/testStore";
import {
  buildChemiTestMessage,
  buildChemiTestShareText,
  canUseSystemShare,
  share,
} from "@/utils/share";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";

const TOP_BAR_HEIGHT = 60;

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  // 케미 페이지 URL 은 두 코드를 직접 담아 완성하므로, friend 를 덧붙이는 useFriendNavigate 를 쓰지 않는다.
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlFriendCode = useFriendCode();
  const rememberedFriendCode = useFriendStore((state) => state.friendCode);
  const nickname = useTestStore((state) => state.nickname);
  const myResultCode = useTestStore((state) => state.resultCode);

  // URL 을 잃어도 친구를 알아봐야 하지만, 남의 결과지를 열었을 때 내 친구가 따라붙으면 안 된다.
  // 그래서 기억해둔 코드는 내가 방금 받은 결과지에서만, 자기 자신이 아닐 때만 쓴다.
  const fallbackFriendCode = id === myResultCode ? rememberedFriendCode : null;
  const friendCode =
    (urlFriendCode ?? fallbackFriendCode) === id ? null : (urlFriendCode ?? fallbackFriendCode);

  const { data, isPending, isError, refetch } = useAssessmentResult(id ?? "");
  const { data: friendData } = useAssessmentResult(friendCode ?? "");
  const { open, close } = useModal();
  const { open: openToast } = useToast();
  const [checkingChemi, setCheckingChemi] = useState(false);

  const { ref: unboxingKitStartRef, hasPassed: isPastHero } = useScrollPassed<HTMLDivElement>({
    offset: TOP_BAR_HEIGHT,
  });
  const { ref: shareResultMarkerRef, isVisible: isShareResultVisible } =
    useIsVisible<HTMLDivElement>({ threshold: 0 });

  // 같은 결과 코드에 대해 refetch 등으로 중복 전송되지 않도록, id별로 1회만 기록한다.
  const trackedResultId = useRef<string | null>(null);
  useEffect(() => {
    if (!data || !id || trackedResultId.current === id) return;
    trackedResultId.current = id;
    trackEvent({ ...GA_EVENTS.RESULT.VIEW, label: data.overview.noun });
  }, [data, id]);

  if (isPending) {
    return <ResultPageSkeleton />;
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

  const {
    overview,
    unboxing_kit,
    features,
    character_story,
    can_do,
    warnings,
    charging,
    compatible_friends,
  } = data;
  const heroTitle = nickname ? `${overview.noun} ${nickname}` : overview.noun;
  const friendNickname = friendCode ? friendData?.participant.nickname : undefined;
  const stickyButtonLabel = friendNickname
    ? `${friendNickname}님과의 케미 보러가기`
    : "친구 케미 테스트";

  // 링크에 내 결과 코드를 담아 보내면, 받은 친구는 코드를 입력하지 않아도 케미를 볼 수 있다.
  const chemiTestUrl = (() => {
    const url = new URL("/", window.location.origin);
    url.searchParams.set("friend", id ?? "");
    return url.toString();
  })();
  const chemiTestMessage = buildChemiTestMessage({
    resultName: overview.result_name,
    url: chemiTestUrl,
  });

  const handleShareChemiTest = async () => {
    try {
      await navigator.clipboard.writeText(chemiTestMessage);
    } catch {
      // 클립보드 권한이 없는 환경에서도 공유 시트는 그대로 띄운다
    }
    trackEvent(GA_EVENTS.RESULT.CHEMI_TEST_SHARE);

    // navigator.share 가 있으면 share() 가 시스템 공유 시트만 띄운다. 없을 때는
    // share() 의 폴백이 클립보드를 URL 로 덮어써서 문구가 사라지므로 직접 안내한다.
    if (canUseSystemShare()) {
      // 링크는 url 로만 넘긴다. text 에 링크를 같이 담으면 시트가 둘을 붙여 링크가 두 번 들어간다.
      await share({
        title: "친구 케미 테스트",
        text: buildChemiTestShareText(overview.result_name),
        url: chemiTestUrl,
      });
    } else {
      openToast("문구를 복사했어요");
    }

    close();
  };

  // 친구 링크로 들어와 테스트를 마친 경우, 두 결과 코드로 케미를 바로 볼 수 있다.
  const handleViewChemi = async () => {
    if (!id || !friendCode || checkingChemi) return;

    setCheckingChemi(true);
    try {
      // 케미 조회가 성공한 뒤에만 이동한다. 캐시에 담아두면 이동 직후 바로 렌더된다.
      await queryClient.fetchQuery({
        queryKey: compatibilityQueryKey(id, friendCode),
        queryFn: () => getCompatibility(id, friendCode),
      });
      trackEvent({
        ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
        label: "결과지_케미보러가기버튼",
      });
      navigate(
        `/compatibility?mine=${encodeURIComponent(id)}&friend=${encodeURIComponent(friendCode)}`,
      );
    } catch {
      openToast("케미 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setCheckingChemi(false);
    }
  };

  const handleStickyButtonClick = () => {
    if (friendNickname) {
      void handleViewChemi();
      return;
    }

    trackEvent(GA_EVENTS.RESULT.CHEMI_TEST_OPEN);
    open({
      title: "친구 케미 테스트",
      contents: <FriendChemiTestModal message={chemiTestMessage} onShare={handleShareChemiTest} />,
    });
  };

  return (
    <div className="bg-gray-00 pb-[92px]">
      {/* ------- 상단 히어로(장난감 소개) UI ------ */}
      <Hero
        title={heroTitle}
        subtitle={overview.adjective}
        badge={overview.rarity}
        tags={overview.tags}
        imageUrl={overview.image_url}
        isTopBarDark={isPastHero}
      />
      <div ref={unboxingKitStartRef} />

      {/* ------- 언박싱 키트(성향 슬라이더) UI ------ */}
      <UnboxingKit unboxingKit={unboxing_kit} />

      {/* ------- 핵심 특징 UI ------ */}
      <KeyFeatures
        features={features}
        imageUrl={overview.image_url}
        storyTitle={character_story.title}
        storyDescription={character_story.description}
      />

      {/* ------- 이렇게 다뤄주세요 UI ------ */}
      <WhatItCanDo can_do={can_do} />

      {/* ------- 이렇게 하면 고장나요 UI ------ */}
      <Warning warnings={warnings} />

      {/* ------- 충전 방법 UI ------ */}
      <Charging charging={charging} />

      {/* ------- 친구 궁합 UI------ */}
      <Compatible compatibleFriends={compatible_friends} />

      {/* ------- 결과지 공유 UI ------ */}
      <ShareResult actionButtonMarkerRef={shareResultMarkerRef} />

      {/* ------- 상·하단 이동 플로팅 버튼 ------ */}
      <ScrollButtons />

      {/* ------- 하단 고정 친구 케미 테스트 버튼 ------ */}
      {!isShareResultVisible && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] cursor-pointer">
          <div className="w-full max-w-[400px]">
            <Button
              variant="solid"
              className="w-full rounded-[10px]"
              disabled={checkingChemi}
              onClick={handleStickyButtonClick}
            >
              {checkingChemi ? <Spinner className="size-6" /> : stickyButtonLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
