import { useState } from "react";
import { motion } from "framer-motion";
import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import { cn } from "@/lib/cn";
import cabinet from "@/assets/img/result/shelf/cabinet.png";
import crownGold from "@/assets/svgs/result/crown-gold.svg";
import crownSilver from "@/assets/svgs/result/crown-silver.svg";
import crownBronze from "@/assets/svgs/result/crown-bronze.svg";
import type { CompatibilityRankingItemOutput } from "@/types/compatibility";

interface RelationShelfProps {
  nickname: string;
  // 점수 내림차순으로 정렬된 상태로 받는다.
  friends: CompatibilityRankingItemOutput[];
  onSelectFriend: (friendCode: string) => void;
}

const PODIUM_COUNT = 3;
const LIST_PAGE_SIZE = 3;

// 진열장 칸 높이가 달라 순서마다 위치를 따로 잡는다. 가운데, 왼쪽, 오른쪽 순.
const PODIUM_SLOTS = [
  { centerX: 150, labelTop: -66, imageTop: -16, imageClass: "size-[90px]" },
  { centerX: 58, labelTop: -39, imageTop: 22, imageClass: "size-[90px]" },
  { centerX: 246, labelTop: 5, imageTop: 65, imageClass: "h-[80px] w-[90px]" },
] as const;

// 동점자는 같은 순위라 왕관 색은 자리 순서가 아니라 순위를 따른다.
const CROWNS: Record<number, string> = { 1: crownGold, 2: crownSilver, 3: crownBronze };

// 이전 결과에는 닉네임이 없을 수 있다.
const displayName = (friend: CompatibilityRankingItemOutput) => friend.nickname ?? friend.noun;

// ------- RelationShelf UI ------
export default function RelationShelf({ nickname, friends, onSelectFriend }: RelationShelfProps) {
  const [visibleCount, setVisibleCount] = useState(LIST_PAGE_SIZE);

  const podium = friends.slice(0, PODIUM_COUNT);
  const rest = friends.slice(PODIUM_COUNT);
  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = rest.length > visibleCount;

  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle
        title={`${nickname}님의 관계 진열장`}
        subtitle="가장 가까운 인연부터 차곡차곡 담았어요"
      />

      {/* ----- 진열장(1~3위) UI ----- */}
      <div className="relative mt-[130px] h-[280px] w-[300px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={cabinet}
            alt=""
            className="absolute top-[3.19%] left-[-2.66%] h-[103.44%] w-[105.32%] max-w-none"
          />
        </div>
        {podium.map((friend, index) => {
          const slot = PODIUM_SLOTS[index];
          return (
            <div key={friend.result_code}>
              <button
                type="button"
                onClick={() => onSelectFriend(friend.result_code)}
                className="absolute flex -translate-x-1/2 cursor-pointer flex-col items-center"
                style={{ left: slot.centerX, top: slot.labelTop }}
              >
                {CROWNS[friend.rank] && (
                  <img src={CROWNS[friend.rank]} alt="" width={19.9} height={12.3356} />
                )}
                <Typography variant="me3" as="span" className="mt-1 font-semibold text-gray-08">
                  {displayName(friend)}
                </Typography>
                <Typography variant="sb4" as="span" className="-mt-1 text-sub-1">
                  {friend.score}점
                </Typography>
              </button>
              <button
                type="button"
                onClick={() => onSelectFriend(friend.result_code)}
                className={`absolute -translate-x-1/2 cursor-pointer ${slot.imageClass}`}
                style={{ left: slot.centerX, top: slot.imageTop }}
              >
                <img
                  src={friend.image_url}
                  alt={friend.noun}
                  className="size-full object-contain"
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* ----- 4위부터 랭킹 리스트 UI ----- */}
      {rest.length > 0 && (
        <div className="flex w-full flex-col">
          {visibleRest.map((friend, index) => (
            <motion.div
              key={friend.result_code}
              // 처음 보이는 묶음은 그대로 두고, 더보기로 붙는 줄만 차례로 펼친다.
              initial={index < LIST_PAGE_SIZE ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: (index % LIST_PAGE_SIZE) * 0.06,
              }}
              className="overflow-hidden"
            >
              <button
                type="button"
                onClick={() => onSelectFriend(friend.result_code)}
                className={cn(
                  "flex h-[70px] w-full cursor-pointer items-center rounded-[10px] bg-white pr-[19px] pl-[15px] text-left",
                  index > 0 && "mt-[10px]",
                )}
              >
                <Typography variant="sb2" as="span" className="w-[13px] text-gray-07">
                  {friend.rank}
                </Typography>
                <img
                  src={friend.image_url}
                  alt={friend.noun}
                  className="ml-[12px] size-[50px] object-contain"
                />
                <span className="ml-[12px] flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-1.5">
                    <Typography variant="h2" as="span" className="text-gray-08">
                      {displayName(friend)}
                    </Typography>
                    <Typography variant="me3" as="span" className="font-semibold text-point">
                      {friend.noun}
                    </Typography>
                  </span>
                  <Typography variant="me3" as="span" className="truncate text-gray-07">
                    {friend.result_name}
                  </Typography>
                </span>
                <Typography variant="sb4" as="span" className="text-sub-1">
                  {friend.score}점
                </Typography>
              </button>
            </motion.div>
          ))}
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + LIST_PAGE_SIZE)}
              className="mt-[10px] h-[40px] cursor-pointer rounded-[10px] border border-gray-02 bg-gray-01"
            >
              <Typography variant="sb3" as="span" className="text-gray-06">
                + 더보기
              </Typography>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
