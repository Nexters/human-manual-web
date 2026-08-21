import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import InfoCard from "@/components/shared/InfoCard";
import Typography from "@/components/shared/Typography";
import MatchupProfileCard from "@/components/compatibility/MatchupProfileCard";
import SynergyScoreCard from "@/components/compatibility/SynergyScoreCard";
import DetailAnalysisCard from "@/components/compatibility/DetailAnalysisCard";
import LongTermTipCard from "@/components/compatibility/LongTermTipCard";
import CompatibilityActionBar from "@/components/compatibility/CompatibilityActionBar";
import { useCompatibility } from "@/hooks/useCompatibility";
import { share } from "@/utils/share";
import { takeResultCode } from "@/lib/resultCode";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";

export default function CompatibilityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 공유 시트에서 복사한 값은 링크 뒤에 설명 문구가 눌러붙어 오므로, 코드만 떼어내 쓴다.
  const mine = takeResultCode(searchParams.get("mine")) ?? "";
  const friend = takeResultCode(searchParams.get("friend")) ?? "";

  const { data, isLoading, isError } = useCompatibility(mine, friend);

  const topBar = (
    <TopBar title="친구와의 케미" onBack={() => navigate(-1)} className="bg-gray-00" />
  );

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

  if (isLoading) {
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

  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col">
      {topBar}

      <div className="flex flex-1 flex-col gap-8 px-5 pt-[54px] pb-8">
        <div className="flex justify-center gap-2">
          <MatchupProfileCard
            name={`${data.mine.noun} ${data.mine.nickname}`}
            image={data.mine.image_url}
            imageAlt={`${data.mine.noun} 캐릭터`}
          />
          <MatchupProfileCard
            name={`${data.friend.noun} ${data.friend.nickname}`}
            image={data.friend.image_url}
            imageAlt={`${data.friend.noun} 캐릭터`}
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

          {data.details.map((detail, index) => (
            <DetailAnalysisCard
              key={detail.key}
              index={index + 1}
              title={detail.title}
              description={detail.description}
            />
          ))}
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

      <CompatibilityActionBar onSave={() => {}} onShare={handleShare} />
    </div>
  );
}
