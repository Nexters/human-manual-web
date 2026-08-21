import { useState } from "react";
import Typography from "@/components/shared/Typography";
import IconInfo from "@/components/shared/icons/IconInfo";

type TraitSliderProps = {
  /** 축의 0점 방향 라벨 (예: 거리조절, 탐색, 탐험, 테토) */
  leftLabel: string;
  /** 축의 100점 방향 라벨 (예: 밀착, 직진, 루틴, 에겐) */
  rightLabel: string;
  /**
   * 원본 축 값(0~100). 항상 rightLabel(100점 방향)의 강도를 뜻한다.
   * 50 미만이면 leftLabel이, 50 이상이면 rightLabel이 우세하다 (동점은 rightLabel 우세로 분류).
   */
  value: number;
  leftDescription: string;
  rightDescription: string;
};

export default function TraitSlider({
  leftLabel,
  rightLabel,
  value,
  leftDescription,
  rightDescription,
}: TraitSliderProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 50점은 100점 쪽(rightLabel) 성향으로 분류한다.
  const isRightDominant = value >= 50;
  // 우세한 쪽 라벨의 값(50~100)만큼 그 쪽에서부터 채운다.
  const fillPercent = isRightDominant ? value : 100 - value;

  return (
    <div className="flex flex-col gap-3">
      {/* ----- 슬라이더 바 ----- */}
      <div className="relative h-2 w-full rounded-full bg-gray-02 overflow-hidden">
        <div
          className="absolute top-0 h-full bg-point transition-all duration-300"
          style={
            isRightDominant
              ? { right: 0, width: `${fillPercent}%` }
              : { left: 0, width: `${fillPercent}%` }
          }
        />
      </div>

      {/* ----- 라벨 ----- */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <Typography
            variant="sb4"
            as="span"
            className={!isRightDominant ? "text-point" : "text-gray-09"}
          >
            {leftLabel}
          </Typography>
          <IconInfo className="size-4 text-gray-05" />
        </button>
        <Typography
          variant="sb4"
          as="span"
          className={isRightDominant ? "text-point" : "text-gray-09"}
        >
          {rightLabel}
        </Typography>
      </div>

      {/* ----- 설명 박스 ----- */}
      {isOpen && (
        <div className="rounded-[10px] bg-white p-4">
          <ul className="flex flex-col gap-3">
            <li className="flex items-start before:mr-2 before:text-gray-08 before:content-['•']">
              <Typography variant="me3" className="text-gray-08 min-w-16 shrink-0">
                {leftLabel}형
              </Typography>
              <Typography variant="me3" className="text-gray-05 break-keep">
                {leftDescription}
              </Typography>
            </li>
            <li className="flex items-start before:mr-2 before:text-gray-08 before:content-['•']">
              <Typography variant="me3" className="text-gray-08 min-w-16 shrink-0">
                {rightLabel}형
              </Typography>
              <Typography variant="me3" className="text-gray-05 break-keep">
                {rightDescription}
              </Typography>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
