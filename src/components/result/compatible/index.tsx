import secretBoxImg from "@/assets/img/result/toy/secret.png";
import teddyBearImg from "@/assets/img/result/toy/teddy_bear.png";
import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import Chip from "@/components/shared/Chip";
import Button from "@/components/shared/Button";
import { useModal } from "@/hooks/useModal";
import InviteFriendModal from "@/components/result/compatible/InviteFriendModal";

const INVITE_CODE = "#01010101";

// ------- Compatible UI ------
export default function Compatible() {
  const { open } = useModal();

  const openInviteModal = (copied: boolean) => {
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(INVITE_CODE);
      } catch {
        // 클립보드 권한이 없는 환경에서도 복사 완료 UI는 그대로 진행한다.
      }
      openInviteModal(true);
      setTimeout(() => openInviteModal(false), 1500);
    };

    open({
      title: "친구 추가",
      description: "친구에게 내 코드를 공유해보세요",
      contents: <InviteFriendModal code={INVITE_CODE} onCopy={handleCopy} />,
      rightButton: {
        label: copied ? "복사 완료!" : "링크 공유",
        variant: "point",
        onClick: handleCopy,
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
          <div
            key={character.name}
            className="flex flex-col items-center gap-3 rounded-[10px] bg-white pt-4 pb-6"
          >
            <Chip className={character.chipColor}>{character.chipLabel}</Chip>
            <img
              src={character.image}
              alt={character.name}
              className="size-[120px] object-contain"
            />
            <div className="flex flex-col items-center gap-1">
              <Typography variant="h2" className="text-gray-08">
                {character.name}
              </Typography>
              <Typography variant="me3" className="text-center text-gray-07">
                {character.description}
              </Typography>
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
        <Button variant="outline" className="w-full" onClick={() => openInviteModal(false)}>
          친구 궁합 자세히 보기 →
        </Button>
      </div>
    </div>
  );
}
