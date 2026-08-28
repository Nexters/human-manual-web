import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import InfoCard from "@/components/shared/InfoCard";
import Typography from "@/components/shared/Typography";
import MatchupProfileCard from "@/components/compatibility/MatchupProfileCard";
import SynergyScoreCard from "@/components/compatibility/SynergyScoreCard";
import DetailAccordionItem from "@/components/compatibility/DetailAccordionItem";
import { DETAIL_CONTENT, DETAIL_ORDER } from "@/components/compatibility/detailAnalysisContent";
import LongTermTipCard from "@/components/compatibility/LongTermTipCard";
import NextChemiSection from "@/components/compatibility/NextChemiSection";
import MyResultModal from "@/components/onboarding/MyResultModal";
import CompatibilityPageSkeleton from "@/components/compatibility/skeleton";
import CoupangPartnersAd from "@/components/shared/CoupangPartnersAd";
import { useCompatibility } from "@/hooks/useCompatibility";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { useFontsReady } from "@/hooks/useFontsReady";
import { share } from "@/utils/share";
import { takeResultCode } from "@/lib/resultCode";
import { useMyResultStore } from "@/stores/myResultStore";
import { appendFriendParam } from "@/lib/friendParam";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";
import { PRETENDARD_FONT_SPEC } from "@/constants/fonts";
import type { CompatibilityDetailOutput } from "@/types/compatibility";

type DetailKey = CompatibilityDetailOutput["key"];

// 매치업 프로필 카드와 상세 분석 카드가 더 이상 커스텀 폰트를 쓰지 않아,
// 이 페이지는 기본 프리텐다드 프리로드만 필요하다.
const COMPATIBILITY_PAGE_FONT_SPECS = [PRETENDARD_FONT_SPEC];

export default function CompatibilityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 공유 시트에서 복사한 값은 링크 뒤에 설명 문구가 눌러붙어 오므로, 코드만 떼어내 쓴다.
  const mine = takeResultCode(searchParams.get("mine")) ?? "";
  const friend = takeResultCode(searchParams.get("friend")) ?? "";

  const { data, isLoading, isError } = useCompatibility(mine, friend);
  const { open: openToast } = useToast();
  const { open: openModal, close: closeModal } = useModal();
  // 열람자가 누구인지는 URL 로 알 수 없다. 이 브라우저에 저장된 코드 하나로만 판단한다.
  const savedResultCode = useMyResultStore((state) => state.resultCode);
  const rememberResultCode = useMyResultStore((state) => state.setResultCode);
  // 저장된 코드가 삭제·만료됐으면 조회가 실패한다. 그때만 코드 없음으로 되돌린다 —
  // 하단 "새 친구와 케미 보기" 가 죽은 코드로 링크를 만들면 안 된다.
  const { data: myResult, isError: myResultError } = useAssessmentResult(savedResultCode ?? "");
  const hasMyCode = Boolean(savedResultCode) && !myResultError;
  const fontsReady = useFontsReady(COMPATIBILITY_PAGE_FONT_SPECS);

  // 아코디언은 각 칸이 독립적으로 열리고 닫힌다.
  const [openKeys, setOpenKeys] = useState<Set<DetailKey>>(new Set());
  const toggleDetail = (key: DetailKey) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 친구 초대 링크로 바로 들어온 경우 앱 안에 쌓인 히스토리가 없어, 뒤로가기가
  // 앱 밖(원래 있던 카톡 등)으로 나가버린다. 그럴 땐 온보딩으로 보낸다.
  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const topBar = <TopBar title="친구와의 케미" onBack={handleBack} className="bg-gray-00" />;

  if (!mine || !friend) {
    return (
      <div className="bg-gray-00 flex min-h-dvh flex-col">
        {topBar}
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <Typography variant="me2" className="text-gray-07">
            잘못된 접근이에요. 친구 초대 링크로 다시 시도해주세요.
          </Typography>
        </div>
      </div>
    );
  }

  if (isLoading || !fontsReady) {
    return <CompatibilityPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="bg-gray-00 flex min-h-dvh flex-col">
        {topBar}
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <Typography variant="me2" className="text-gray-07">
            케미 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </Typography>
        </div>
      </div>
    );
  }

  // headline 은 "찰떡궁합 환상의 장난감" 처럼 항상 "~~ 장난감" 꼴로 온다.
  // 마지막 낱말만 남기고 앞부분을 포인트 컬러로 가른다.
  const headlineWords = data.headline.trim().split(/\s+/);
  const headlineNoun = headlineWords.at(-1) ?? "";
  const headlineModifier = headlineWords.slice(0, -1).join(" ");

  // 저장된 내 코드로 초대 링크를 만든다. 이 링크를 받은 친구 화면에서 나와의 케미가 열린다.
  const handleCopyMyChemiLink = async (resultCode: string) => {
    if (!resultCode) return;
    const url = new URL("/", window.location.origin);
    url.searchParams.set("friend", resultCode);

    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {
      // 클립보드 권한이 없는 환경에서도 안내는 그대로 노출한다
    }
    trackEvent({
      ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
      label: "케미페이지_내케미링크복사",
    });
    openToast("내 케미 링크를 복사했어요");
  };

  // 코드가 이 브라우저에 없지만 다른 기기에서 이미 테스트를 마친 사람용.
  // 코드를 받아 저장한 뒤 곧바로 링크까지 복사해준다 — 홈으로 튕겨 보내면 흐름이 끊긴다.
  const openMyCodeModal = () => {
    openModal({
      title: "내 코드 입력하기",
      contents: (
        <MyResultModal
          description={
            <>
              코드를 입력하면 친구에게 보낼
              <br />내 케미 테스트 링크를 만들 수 있어요
            </>
          }
          submitLabel="링크 복사하기"
          onSubmit={(resultCode) => {
            closeModal();
            rememberResultCode(resultCode);
            void handleCopyMyChemiLink(resultCode);
          }}
        />
      ),
    });
  };

  const handleShare = () => {
    trackEvent(GA_EVENTS.COMPATIBILITY.RESULT_SHARE);
    return share({
      title: data.headline,
      text: data.description,
      url: window.location.href,
    });
  };

  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col">
      {topBar}

      <div className="flex flex-1 flex-col gap-8 bg-gray-00 px-5 pt-[54px] pb-8">
        {/* ------- 헤드라인 (프로필 위) ------ */}
        <div className="flex flex-col items-center gap-1 text-center">
          <Typography variant="h2" className="text-gray-08">
            <span className="text-sub-4">{headlineModifier}</span>
            {headlineModifier && " "}
            {headlineNoun}
          </Typography>
          <Typography variant="me2" className="text-gray-07">
            {data.description}
          </Typography>
        </div>

        {/* ------- 매치업 프로필 ------ */}
        <div className="flex items-start justify-center gap-4">
          <MatchupProfileCard
            nickname={data.mine.nickname}
            noun={data.mine.noun}
            image={data.mine.image_url}
            imageAlt={`${data.mine.noun} 캐릭터`}
            onViewResult={() => navigate(appendFriendParam(`/result/${mine}`, friend))}
          />
          <div className="flex h-[134px] items-center justify-center">
            <Typography variant="h2" className="text-gray-03">
              ×
            </Typography>
          </div>
          <MatchupProfileCard
            nickname={data.friend.nickname}
            noun={data.friend.noun}
            image={data.friend.image_url}
            imageAlt={`${data.friend.noun} 캐릭터`}
            onViewResult={() => navigate(appendFriendParam(`/result/${friend}`, mine))}
          />
        </div>

        <SynergyScoreCard
          score={data.synergy.score}
          label={data.synergy.title}
          description={data.synergy.description}
          tags={data.synergy.tags}
        />

        {/* ------- 우리 사이 더 자세히 보기 (아코디언) ------ */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <Typography variant="h2" className="text-gray-08">
              우리 사이 더 자세히 보기
            </Typography>
            <Typography variant="me2" className="text-gray-07">
              카드를 열어 우리 사이를 자세히 살펴봐요
            </Typography>
          </div>

          <div className="flex flex-col gap-[10px]">
            {DETAIL_ORDER.map((key) => {
              const detail = data.details.find((item) => item.key === key);
              if (!detail) return null;
              const content = DETAIL_CONTENT[key];
              return (
                <DetailAccordionItem
                  key={key}
                  icon={content.icon}
                  question={content.question}
                  description={detail.description}
                  isOpen={openKeys.has(key)}
                  onToggle={() => toggleDetail(key)}
                />
              );
            })}
          </div>
        </div>

        {/* ------- 함께 있을 때 기억해주세요 ------ */}
        <div className="flex flex-col gap-4">
          <Typography variant="h2" className="text-gray-08 text-center">
            함께 있을 때 기억해주세요
          </Typography>

          {data.tips.map((tip) => (
            <InfoCard
              key={tip.target}
              icon={
                <img
                  src={tip.image_url}
                  alt={`${tip.title} 캐릭터`}
                  className="size-14 object-contain"
                />
              }
              title={tip.title}
              description={tip.description}
            />
          ))}
        </div>

        <LongTermTipCard
          title={data.relationship_tip.title}
          description={data.relationship_tip.description}
        />
      </div>

      {/* ------- 다른 친구랑 케미 보기 ------ */}
      <NextChemiSection
        myNickname={data.mine.nickname}
        myImageUrl={hasMyCode ? myResult?.overview.image_url : undefined}
        hasMyCode={hasMyCode}
        onShareMyChemiLink={() => void handleCopyMyChemiLink(savedResultCode ?? "")}
        onStartTest={() => navigate("/", { state: { startTest: true } })}
        onEnterCode={openMyCodeModal}
        onShareChemiPage={() => void handleShare()}
      />

      {/* ------- 쿠팡 파트너스 광고 ------ */}
      <CoupangPartnersAd />
    </div>
  );
}
