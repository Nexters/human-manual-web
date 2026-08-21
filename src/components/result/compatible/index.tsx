import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import Chip from "@/components/shared/Chip";
import { cn } from "@/lib/cn";
import type { CompatibleFriendOutput } from "@/types/assessment";

interface CompatibleProps {
  compatibleFriends: CompatibleFriendOutput[];
}

const BADGE_COLORS = ["bg-main text-gray-00", "bg-sub-4 text-gray-00"] as const;

// ------- Compatible UI ------
export default function Compatible({ compatibleFriends }: CompatibleProps) {
  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="COMPATIBLE" subtitle="나와 잘 맞는 친구 케미" />

      {/* ----- 캐릭터 카드 UI ----- */}
      <div className="grid grid-cols-2 gap-3">
        {compatibleFriends.map((friend, index) => (
          <div key={friend.character_id} className="flex h-full flex-col items-center">
            <Chip
              variant="me2"
              className={cn("z-10 -mb-[17px]", BADGE_COLORS[index % BADGE_COLORS.length])}
            >
              {friend.badge}
            </Chip>
            <div className="flex w-full flex-1 flex-col items-center gap-3 rounded-[10px] bg-white pt-8 pb-6">
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
    </div>
  );
}
