import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import InfoCard from "@/components/shared/InfoCard";
import Typography from "@/components/shared/Typography";
import MatchupProfileCard from "@/components/compatibility/MatchupProfileCard";
import SynergyScoreCard from "@/components/compatibility/SynergyScoreCard";
import LongTermTipCard from "@/components/compatibility/LongTermTipCard";
import CompatibilityActionBar from "@/components/compatibility/CompatibilityActionBar";
import { useCompatibility } from "@/hooks/useCompatibility";
import { getCharacterAsset } from "@/constants/characters";

export default function CompatibilityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mine = searchParams.get("mine") ?? "";
  const friend = searchParams.get("friend") ?? "";

  const { data, isLoading, isError } = useCompatibility(mine, friend);

  const topBar = (
    <TopBar title="친구와의 궁합" onBack={() => navigate(-1)} className="bg-gray-00" />
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
    return (
      <div className="bg-gray-00 flex min-h-dvh flex-col">
        {topBar}
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <Typography variant="me2" className="text-gray-07">
            궁합을 확인하고 있어요...
          </Typography>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-gray-00 flex min-h-dvh flex-col">
        {topBar}
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <Typography variant="me2" className="text-gray-07">
            궁합 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </Typography>
        </div>
      </div>
    );
  }

  const mineAsset = getCharacterAsset(data.mine.character_id);
  const friendAsset = getCharacterAsset(data.friend.character_id);

  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col">
      {topBar}

      <div className="flex flex-1 flex-col gap-8 px-5 pt-[54px] pb-8">
        <div className="flex justify-center gap-2">
          <MatchupProfileCard
            variant="me"
            role="나"
            name={`${data.mine.noun} ${data.mine.nickname}`}
            image={mineAsset.image}
            imageAlt={mineAsset.alt}
          />
          <MatchupProfileCard
            variant="friend"
            role="친구"
            name={`${data.friend.noun} ${data.friend.nickname}`}
            image={friendAsset.image}
            imageAlt={friendAsset.alt}
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
            함께 있을 때 기억해주세요
          </Typography>

          {data.tips.map((tip) => {
            const asset = getCharacterAsset(tip.character_id);
            return (
              <InfoCard
                key={tip.target}
                icon={<img src={asset.image} alt={asset.alt} className="size-14 object-contain" />}
                title={tip.title}
                description={tip.description}
              />
            );
          })}
        </div>

        <LongTermTipCard
          title={data.relationship_tip.title}
          description={data.relationship_tip.description}
        />
      </div>

      <CompatibilityActionBar onSave={() => {}} onShare={() => {}} />
    </div>
  );
}
