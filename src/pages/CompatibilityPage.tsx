import { useNavigate } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import InfoCard from "@/components/shared/InfoCard";
import Typography from "@/components/shared/Typography";
import MatchupProfileCard from "@/components/compatibility/MatchupProfileCard";
import SynergyScoreCard from "@/components/compatibility/SynergyScoreCard";
import LongTermTipCard from "@/components/compatibility/LongTermTipCard";
import CompatibilityActionBar from "@/components/compatibility/CompatibilityActionBar";
import spinningTop from "@/assets/img/compatibility-spinning-top.png";
import bearLarge from "@/assets/img/compatibility-bear-large.png";
import bearThumbnail from "@/assets/img/compatibility-bear-thumbnail.png";

export default function CompatibilityPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col">
      <TopBar title="친구와의 궁합" onBack={() => navigate(-1)} className="bg-gray-00" />

      <div className="flex flex-1 flex-col gap-8 px-5 pt-[54px] pb-8">
        <div className="flex justify-center gap-2">
          <MatchupProfileCard
            variant="me"
            role="나"
            name="팽이 지은"
            image={spinningTop}
            imageAlt="팽이 캐릭터"
          />
          <MatchupProfileCard
            variant="friend"
            role="친구"
            name="곰인형 선우"
            image={bearLarge}
            imageAlt="곰인형 캐릭터"
          />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <Typography variant="h2" className="text-gray-08">
            찰떡궁합 환상의 장난감
          </Typography>
          <Typography variant="me2" className="text-gray-07">
            서로의 아이디어를 키워주는 신나는 조합이에요
          </Typography>
        </div>

        <SynergyScoreCard
          score={80}
          label="낼 수 있는 시너지띠"
          description="새로운 일을 시작하면 이 친구는 색다른 시선을 더해줘요. 둘이 대화할수록 아이디어가 선명해져요."
          tags={["즉흥적인 케미", "아이디어 시너지"]}
        />

        <div className="flex flex-col gap-4">
          <Typography variant="h2" className="text-gray-08 text-center">
            함께 있을 때 기억해주세요
          </Typography>

          <InfoCard
            icon={<img src={spinningTop} alt="팽이 캐릭터" className="size-14 object-contain" />}
            title="지은님에게"
            description="갑작스러운 변화는 미리 알려주고 직설적인 말은 부드럽게 다듬어주세요."
          />
          <InfoCard
            icon={
              <img src={bearThumbnail} alt="곰인형 캐릭터" className="size-14 object-contain" />
            }
            title="선우님에게"
            description="즉흥적인 행동을 무책임함으로 단정하지 말고, 불편한 점은 솔직하게 알려주세요."
          />
        </div>

        <LongTermTipCard
          title="더 오래 잘 지내려면"
          description="서로의 속도를 바꾸려 하기보다 차이를 이해해 주세요. 팽이는 갑작스러운 계획을 미리 알려주고, 비밀상자는 불편한 마음을 참지 않고 표현하면 돼요."
        />
      </div>

      <CompatibilityActionBar onSave={() => {}} onShare={() => {}} />
    </div>
  );
}
