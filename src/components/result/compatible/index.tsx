import { useParams } from "react-router-dom";
import secretBoxImg from "@/assets/img/result/toy/secret.png";
import teddyBearImg from "@/assets/img/result/toy/teddy_bear.png";
import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import Chip from "@/components/shared/Chip";
import Button from "@/components/shared/Button";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import InviteFriendModal from "@/components/result/compatible/InviteFriendModal";
import { cn } from "@/lib/cn";
import { share } from "@/utils/share";

// ------- Compatible UI ------
export default function Compatible() {
  const { id } = useParams<{ id: string }>();
  const inviteCode = id ?? "";
  const { open } = useModal();
  const { open: openToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
    } catch {
      // 클립보드 권한이 없는 환경에서도 복사 완료 토스트는 그대로 노출한다.
    }
    openToast("코드 번호가 복사되었습니다");
  };

  const handleShare = async () => {
    await share({
      title: "친구 궁합",
      text: "내 코드로 친구 궁합을 확인해보세요",
      url: window.location.href,
    });
  };

  const openInviteModal = () => {
    open({
      contents: <InviteFriendModal code={inviteCode} onCopy={handleCopy} />,
      rightButton: {
        label: "링크 공유",
        variant: "point",
        onClick: handleShare,
      },
    });
  };

  const characters = [
    {
      name: "비밀 상자",
      description: "당신의 아이디어를 깊이 이해하고 방향을 잡아줘요",
      image: secretBoxImg,
      chipLabel: "환상의 장난감",
      chipColor: "bg-main text-gray-00",
    },
    {
      name: "곰인형",
      description: "즉흥적인 당신과 안정적인 친구는 속도가 달라요",
      image: teddyBearImg,
      chipLabel: "환장의 장난감",
      chipColor: "bg-sub-4 text-gray-00",
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="COMPATIBLE" subtitle="나와 잘 맞는 친구 궁합" />

      {/* Character Cards */}
      <div className="grid grid-cols-2 gap-3">
        {characters.map((character) => (
          <div key={character.name} className="flex flex-col items-center">
            <Chip className={cn("z-10 -mb-[17px]", character.chipColor)}>
              {character.chipLabel}
            </Chip>
            <div className="flex w-full flex-col items-center gap-3 rounded-[10px] bg-white pt-8 pb-6">
              <img
                src={character.image}
                alt={character.name}
                className="size-[120px] object-contain"
              />
              <div className="flex flex-col items-center gap-1">
                <Typography variant="h2" className="text-gray-08">
                  {character.name}
                </Typography>
                <Typography variant="me3" className="text-center text-gray-07 break-keep">
                  {character.description}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <hr className="w-full border-t border-gray-03" />
        <Typography variant="me2" className="text-gray-05">
          친구별 케미와 관계 팁이 궁금하다면?
        </Typography>
        <Button variant="outline" className="w-full" onClick={openInviteModal}>
          친구 궁합 자세히 보기 →
        </Button>
      </div>
    </div>
  );
}
