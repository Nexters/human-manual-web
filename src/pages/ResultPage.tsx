import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import SaveResultPrompt from "@/components/auth/SaveResultPrompt";
import Hero from "@/components/result/hero";
import UnboxingKit from "@/components/result/unboxingKit";
import KeyFeatures from "@/components/result/keyFeatures";
import WhatItCanDo from "@/components/result/whatItCanDo";
import Warning from "@/components/result/warning";
import Charging from "@/components/result/charging";
import Compatible from "@/components/result/compatible";
import RelationShelf from "@/components/result/relationShelf";
import ShareResult from "@/components/result/shareResult";
import FriendChemiTestModal from "@/components/result/FriendChemiTestModal";
import ResultPageSkeleton from "@/components/result/skeleton";
import ScrollButtons from "@/components/result/ScrollButtons";
import CoupangPartnersAd from "@/components/shared/CoupangPartnersAd";
import Typography from "@/components/shared/Typography";
import Button from "@/components/shared/Button";
import { useScrollPassed } from "@/hooks/useScrollPassed";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useFontsReady } from "@/hooks/useFontsReady";
import { getCompatibility } from "@/api/compatibility";
import { compatibilityQueryKey, useCompatibilityRanking } from "@/hooks/useCompatibility";
import { useFriendCode } from "@/hooks/useFriendCode";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { useMyResultStore } from "@/stores/myResultStore";
import { useAuth } from "@/hooks/useAuth";
import { startKakaoLogin } from "@/lib/auth";
import { buildChemiTestMessage, canUseSystemShare, share } from "@/utils/share";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";
import { PRETENDARD_FONT_SPEC, WAGURI_FONT_SPEC } from "@/constants/fonts";

const TOP_BAR_HEIGHT = 60;

// 히어로 캐릭터 타이틀에 Waguri를 쓴다. 공유 링크로 온보딩 없이 바로 이 페이지에
// 들어오는 경우가 있어, 온보딩 첫 화면의 폰트 프리로드를 못 받았을 수 있다.
const RESULT_PAGE_FONT_SPECS = [PRETENDARD_FONT_SPEC, WAGURI_FONT_SPEC];

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  // 케미 페이지 URL 은 두 코드를 직접 담아 완성하므로, friend 를 덧붙이는 useFriendNavigate 를 쓰지 않는다.
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const auth = useAuth();
  // 결과지 주인과 초대한 사람이 같으면 친구 결과지를 구경하는 초대 유입이다.
  const urlFriendCode = useFriendCode();
  const friendCode = urlFriendCode === id ? null : urlFriendCode;
  const myResultCode = useMyResultStore((state) => state.resultCode);
  const viewingInviter = Boolean(urlFriendCode === id && myResultCode !== id);
  const { data: viewerResult, isLoading: viewerLoading } = useAssessmentResult(
    viewingInviter ? (myResultCode ?? "") : "",
  );

  const { data, isPending, isError, refetch } = useAssessmentResult(id ?? "");
  const { data: friendData } = useAssessmentResult(friendCode ?? "");
  const { data: rankingData } = useCompatibilityRanking(id ?? "");
  const { open, close } = useModal();
  const { open: openToast } = useToast();
  const [checkingChemi, setCheckingChemi] = useState(false);
  const fontsReady = useFontsReady(RESULT_PAGE_FONT_SPECS);

  const { ref: unboxingKitStartRef, hasPassed: isPastHero } = useScrollPassed<HTMLDivElement>({
    offset: TOP_BAR_HEIGHT,
  });

  // 같은 결과 코드에 대해 refetch 등으로 중복 전송되지 않도록, id별로 1회만 기록한다.
  const trackedResultId = useRef<string | null>(null);
  useEffect(() => {
    if (!data || !id || trackedResultId.current === id) return;
    trackedResultId.current = id;
    trackEvent({ ...GA_EVENTS.RESULT.VIEW, label: data.overview.noun });
  }, [data, id]);

  if (isPending || !fontsReady) {
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
  // 닉네임은 이 결과지의 주인 것을 쓴다. 내 스토어 값을 쓰면 남의 결과지를 열었을 때
  // 남의 캐릭터에 내 이름이 붙는다.
  const resultNickname = data.participant.nickname;
  const heroTitle = resultNickname ? `${overview.noun} ${resultNickname}` : overview.noun;
  const friendNickname = viewingInviter
    ? viewerResult?.participant.nickname
    : friendCode
      ? friendData?.participant.nickname
      : undefined;
  const friendImageUrl = viewingInviter
    ? viewerResult?.overview.image_url
    : friendCode
      ? friendData?.overview.image_url
      : undefined;
  const chemiMine = viewingInviter ? myResultCode : id;
  const chemiFriend = viewingInviter ? id : friendCode;

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
    // 데스크톱 크롬에도 navigator.share 가 있어서 공유 시트가 열린다. 시트를 닫아버리면
    // 복사된 줄 모르니, 복사는 이미 끝났다는 걸 어느 환경에서든 알려준다.
    openToast("문구를 복사했어요");

    // share() 의 폴백은 클립보드를 덮어쓰므로, 시트를 쓸 수 있을 때만 호출한다.
    if (canUseSystemShare()) {
      // 호환성 페이지 공유와 동일하게 title/text/url을 분리해서 넘긴다.
      await share({
        title: `나 '${overview.result_name}' 나왔어.`,
        text: "우리 케미는 몇 점일까? 여기서 확인해줘!",
        url: chemiTestUrl,
      });
    }

    close();
  };

  // 문구와 링크가 한 문자열이면 주소창에 붙여넣어도 이동할 수 없다. 링크만 따로 복사한다.
  const handleCopyChemiLink = async () => {
    try {
      await navigator.clipboard.writeText(chemiTestUrl);
    } catch {
      // 클립보드 권한이 없는 환경에서도 안내는 그대로 노출한다
    }
    openToast("링크를 복사했어요");
    close();
  };

  // 친구 링크로 들어와 테스트를 마친 경우, 두 결과 코드로 케미를 바로 볼 수 있다.
  const handleViewChemi = async () => {
    if (!chemiMine || !chemiFriend || chemiMine === chemiFriend || checkingChemi) return;

    setCheckingChemi(true);
    try {
      // 케미 조회가 성공한 뒤에만 이동한다. 캐시에 담아두면 이동 직후 바로 렌더된다.
      await queryClient.fetchQuery({
        queryKey: compatibilityQueryKey(chemiMine, chemiFriend),
        queryFn: () => getCompatibility(chemiMine, chemiFriend),
      });
      trackEvent({
        ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
        label: "결과지_케미보러가기버튼",
      });
      navigate(
        `/compatibility?mine=${encodeURIComponent(chemiMine)}&friend=${encodeURIComponent(chemiFriend)}`,
      );
    } catch {
      openToast("케미 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setCheckingChemi(false);
    }
  };

  const openInvitedChemiOptions = () => {
    if (!id) return;
    const restorePath = `/?friend=${encodeURIComponent(id)}&restore=1`;
    open({
      title: `${resultNickname}님과 케미 보기`,
      contents: (
        <div className="flex w-full flex-col gap-3">
          <Typography variant="me2" className="text-gray-06 mb-2 text-center break-keep">
            새로 테스트하거나 보관된 결과로 케미를 확인해보세요.
          </Typography>
          <Button
            onClick={() => {
              close();
              navigate(`/?friend=${encodeURIComponent(id)}&start=1`);
            }}
          >
            새로 테스트하기
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              close();
              if (auth.data) navigate(restorePath);
              else startKakaoLogin(restorePath);
            }}
          >
            {auth.data
              ? "이미 테스트했다면? 기존 결과로 바로 보기"
              : "이미 테스트했다면? 로그인하고 바로 보기"}
          </Button>
        </div>
      ),
    });
  };

  const navigateToCompatibility = (mine: string, friend: string) => {
    navigate(
      `/compatibility?mine=${encodeURIComponent(mine)}&friend=${encodeURIComponent(friend)}`,
    );
  };

  const openChemiTestModal = () => {
    trackEvent(GA_EVENTS.RESULT.CHEMI_TEST_OPEN);
    open({
      title: "친구 케미 테스트",
      contents: (
        <FriendChemiTestModal
          message={chemiTestMessage}
          onShare={handleShareChemiTest}
          onCopyLink={handleCopyChemiLink}
        />
      ),
    });
  };

  return (
    <div className="bg-gray-00 pb-8">
      {/* ------- 상단 히어로(장난감 소개) UI ------ */}
      <Hero
        title={heroTitle}
        subtitle={overview.adjective}
        badge={overview.rarity}
        tags={overview.tags}
        imageUrl={overview.image_url}
        isTopBarDark={isPastHero}
      />
      <SaveResultPrompt resultCode={id ?? ""} />
      <div ref={unboxingKitStartRef} />

      {/* ------- 핵심 특징 UI ------ */}
      <KeyFeatures
        features={features}
        imageUrl={overview.image_url}
        storyTitle={character_story.title}
        storyDescription={character_story.description}
      />

      {/* ------- 언박싱 키트(성향 슬라이더) UI ------ */}
      <UnboxingKit unboxingKit={unboxing_kit} />

      {/* ------- 이렇게 다뤄주세요 UI ------ */}
      <WhatItCanDo can_do={can_do} />

      {/* ------- 이렇게 하면 고장나요 UI ------ */}
      <Warning warnings={warnings} />

      {/* ------- 충전 방법 UI ------ */}
      <Charging charging={charging} />

      {/* ------- 친구 궁합 UI------ */}
      <Compatible compatibleFriends={compatible_friends} />

      {/* ------- 관계 진열장(케미 랭킹) UI ------ */}
      {/* 조회에 성공한 빈 진열장도 보여주되 조회 실패를 빈 기록으로 표시하지 않는다. */}
      {rankingData && (
        <RelationShelf
          nickname={resultNickname}
          friends={rankingData.rankings}
          onSelectFriend={(friendResultCode) => navigateToCompatibility(id ?? "", friendResultCode)}
        />
      )}

      {/* ------- 결과지 공유 UI ------ */}
      <ShareResult
        nickname={resultNickname}
        imageUrl={overview.image_url}
        friendNickname={friendNickname}
        friendImageUrl={friendImageUrl}
        isCheckingChemi={checkingChemi || viewerLoading}
        invitation={
          viewingInviter
            ? {
                hasMyResult: Boolean(viewerResult),
                onStart: openInvitedChemiOptions,
              }
            : undefined
        }
        onSendChemiTest={openChemiTestModal}
        onViewChemi={() => void handleViewChemi()}
      />

      {/* ------- 쿠팡 파트너스 광고 ------ */}
      <CoupangPartnersAd />

      {/* ------- 상·하단 이동 플로팅 버튼 ------ */}
      <ScrollButtons />
    </div>
  );
}
