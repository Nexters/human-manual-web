import { useParams } from "react-router-dom";
import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import Chip from "@/components/shared/Chip";
import Button from "@/components/shared/Button";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import InviteFriendModal from "@/components/result/compatible/InviteFriendModal";
import { cn } from "@/lib/cn";
import { share } from "@/utils/share";
import type { CompatibleFriendOutput } from "@/types/assessment";

interface CompatibleProps {
  compatibleFriends: CompatibleFriendOutput[];
}

const BADGE_COLORS = ["bg-main text-gray-00", "bg-sub-4 text-gray-00"] as const;

// ------- Compatible UI ------
export default function Compatible({ compatibleFriends }: CompatibleProps) {
  const { id } = useParams<{ id: string }>();
  const inviteCode = id ?? "";
  const { open } = useModal();
  const { open: openToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
    } catch {
      // 클립보드 권한이 없는 환경에서도 복사 완료 토스트는 그대로 노출
    }
    openToast("코드 번호가 복사되었습니다");
  };

  const handleShare = async () => {
    const url = new URL("/", window.location.origin);
    url.searchParams.set("friend", inviteCode);

    await share({
      title: "친구 궁합",
      text: "내 코드로 친구 궁합을 확인해보세요",
      url: url.toString(),
    });
  };

  const openInviteModal = () => {
    open({
      contents: <InviteFriendModal code={inviteCode} onCopy={handleCopy} />,
      confirmLabel: "링크 공유",
      onConfirm: handleShare,
    });
  };

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="COMPATIBLE" subtitle="나와 잘 맞는 친구 궁합" />

      {/* ----- 캐릭터 카드 UI ----- */}
      <div className="grid grid-cols-2 gap-3">
        {compatibleFriends.map((friend, index) => (
          <div key={friend.character_id} className="flex flex-col items-center">
            <Chip
              variant="me2"
              className={cn("z-10 -mb-[17px]", BADGE_COLORS[index % BADGE_COLORS.length])}
            >
              {friend.badge}
            </Chip>
            <div className="flex w-full flex-col items-center gap-3 rounded-[10px] bg-white pt-8 pb-6">
              <img
                src={friend.image_url}
                alt={friend.noun}
                className="size-[120px] object-contain"
              />
              <div className="flex flex-col items-center gap-1">
                <Typography variant="h2" className="text-gray-08">
                  {friend.noun}
                </Typography>
                <Typography variant="me3" className="text-center text-gray-07 break-keep">
                  {friend.description}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ----- 궁합보기 버튼 UI ----- */}
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
