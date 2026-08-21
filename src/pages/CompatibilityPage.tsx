import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import InfoCard from "@/components/shared/InfoCard";
import Typography from "@/components/shared/Typography";
import MatchupProfileCard from "@/components/compatibility/MatchupProfileCard";
import SynergyScoreCard from "@/components/compatibility/SynergyScoreCard";
import DetailAnalysisCard from "@/components/compatibility/DetailAnalysisCard";
import { DETAIL_CONTENT, DETAIL_ORDER } from "@/components/compatibility/detailAnalysisContent";
import LongTermTipCard from "@/components/compatibility/LongTermTipCard";
import CompatibilityActionBar from "@/components/compatibility/CompatibilityActionBar";
import CoupangPartnersAd from "@/components/shared/CoupangPartnersAd";
import { useCompatibility } from "@/hooks/useCompatibility";
import { useFontsReady } from "@/hooks/useFontsReady";
import { share } from "@/utils/share";
import { saveElementAsImage } from "@/utils/captureImage";
import { takeResultCode } from "@/lib/resultCode";
import { appendFriendParam } from "@/lib/friendParam";
import { useToast } from "@/hooks/useToast";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";
import { PRETENDARD_FONT_SPEC } from "@/constants/fonts";

// 매치업 프로필 카드와 상세 분석 카드가 더 이상 커스텀 폰트를 쓰지 않아,
// 이 페이지는 기본 프리텐다드 프리로드만 필요하다.
const COMPATIBILITY_PAGE_FONT_SPECS = [PRETENDARD_FONT_SPEC];

export default function CompatibilityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { open: openToast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  // 공유 시트에서 복사한 값은 링크 뒤에 설명 문구가 눌러붙어 오므로, 코드만 떼어내 쓴다.
  const mine = takeResultCode(searchParams.get("mine")) ?? "";
  const friend = takeResultCode(searchParams.get("friend")) ?? "";

  const { data, isLoading, isError } = useCompatibility(mine, friend);
  const fontsReady = useFontsReady(COMPATIBILITY_PAGE_FONT_SPECS);

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
    // TODO: 스켈레톤 UI 추가
    return null;
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

  const handleShare = () => {
    trackEvent(GA_EVENTS.COMPATIBILITY.RESULT_SHARE);
    return share({
      title: data.headline,
      text: data.description,
      url: window.location.href,
    });
  };

  const handleSave = async () => {
    if (!contentRef.current || isSaving) return;

    trackEvent(GA_EVENTS.COMPATIBILITY.RESULT_SAVE);
    setIsSaving(true);
    try {
      await saveElementAsImage(
        contentRef.current,
        `${data.mine.nickname}-${data.friend.nickname}-케미.png`,
      );
    } catch {
      openToast("이미지 저장에 실패했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col">
      {topBar}

      <div ref={contentRef} className="flex flex-1 flex-col gap-8 bg-gray-00 px-5 pt-[54px] pb-8">
        <div className="flex items-start justify-center gap-4">
          <MatchupProfileCard
            nickname={data.mine.nickname}
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
            image={data.friend.image_url}
            imageAlt={`${data.friend.noun} 캐릭터`}
            onViewResult={() => navigate(appendFriendParam(`/result/${friend}`, mine))}
          />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <Typography variant="h2" className="text-gray-08">
            {data.headline}
          </Typography>
          <Typography variant="me2" className="text-gray-07">
            {data.description}
          </Typography>
        </div>

        <SynergyScoreCard
          score={data.synergy.score}
          label={data.synergy.title}
          description={data.synergy.description}
          tags={data.synergy.tags}
        />

        <div className="flex flex-col gap-4">
          <Typography variant="h2" className="text-gray-08 text-center">
            우리 사이 더 자세히 보기
          </Typography>

          <div className="grid grid-cols-2 gap-[10px]">
            {DETAIL_ORDER.map((key) => {
              const detail = data.details.find((item) => item.key === key);
              if (!detail) return null;
              const content = DETAIL_CONTENT[key];
              return (
                <DetailAnalysisCard
                  key={key}
                  icon={content.icon}
                  titleBefore={content.titleBefore}
                  titleHighlight={content.titleHighlight}
                  titleAfter={content.titleAfter}
                  description={detail.description}
                />
              );
            })}
          </div>
        </div>

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

      <CompatibilityActionBar
        onSave={() => void handleSave()}
        onShare={handleShare}
        saveDisabled={isSaving}
      />

      {/* ------- 쿠팡 파트너스 광고 ------ */}
      <CoupangPartnersAd />
    </div>
  );
}
