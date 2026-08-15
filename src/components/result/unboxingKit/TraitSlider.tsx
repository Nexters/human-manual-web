import { useState } from "react";
import Typography from "@/components/shared/Typography";
import IconInfo from "@/components/shared/icons/IconInfo";

type TraitSliderProps = {
  label1: string;
  label2: string;
  /**
   * label1 기준 점수(0~100). 50 이상이면 label1 쪽이, 미만이면 label2 쪽이 우세로 강조된다.
   * 0은 원본 축 값이 0(미측정/데이터 없음)이었다는 뜻이므로 중립으로 처리한다.
   */
  value: number;
  description1: string;
  description2: string;
};

export default function TraitSlider({
  label1,
  label2,
  value,
  description1,
  description2,
}: TraitSliderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isNeutral = value === 0;
  const isLabel1Dominant = value >= 50;

  return (
    <div className="flex flex-col gap-3">
      {/* Slider Bar */}
      <div className="relative h-2 w-full rounded-full bg-gray-02 overflow-hidden">
        {!isNeutral && (
          <div
            className="absolute top-0 h-full bg-point transition-all duration-300"
            style={
              isLabel1Dominant
                ? { left: 0, width: `${value}%` }
                : { right: 0, width: `${100 - value}%` }
            }
          />
        )}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <Typography
            variant="sb4"
            as="span"
            className={!isNeutral && isLabel1Dominant ? "text-point" : "text-gray-09"}
          >
            {label1}
          </Typography>
          <IconInfo className="size-4 text-gray-05" />
        </button>
        <Typography
          variant="sb4"
          as="span"
          className={!isNeutral && !isLabel1Dominant ? "text-point" : "text-gray-09"}
        >
          {label2}
        </Typography>
      </div>

      {/* Description Box */}
      {isOpen && (
        <div className="rounded-[10px] bg-white p-4">
          <ul className="flex flex-col gap-3">
            <li className="flex items-start before:mr-2 before:text-gray-08 before:content-['•']">
              <Typography variant="me3" className="text-gray-08 min-w-16 shrink-0">
                {label1}형
              </Typography>
              <Typography variant="me3" className="text-gray-05">
                {description1}
              </Typography>
            </li>
            <li className="flex items-start before:mr-2 before:text-gray-08 before:content-['•']">
              <Typography variant="me3" className="text-gray-08 min-w-16 shrink-0">
                {label2}형
              </Typography>
              <Typography variant="me3" className="text-gray-05">
                {description2}
              </Typography>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
