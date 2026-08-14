import { useState } from "react";
import Typography from "@/components/shared/Typography";
import IconInfo from "@/components/shared/icons/IconInfo";

type TraitSliderProps = {
  label1: string;
  label2: string;
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

  return (
    <div className="flex flex-col gap-3">
      {/* Slider Bar */}
      <div className="relative h-2 w-full rounded-full bg-gray-02 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-point transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <Typography variant="sb4" as="span" className="text-gray-09">
            {label1}
          </Typography>
          <IconInfo className="size-4 text-gray-05" />
        </button>
        <Typography variant="sb4" as="span" className="text-point">
          {label2}
        </Typography>
      </div>

      {/* Description Box */}
      {isOpen && (
        <div className="flex flex-col gap-2 rounded-[10px] bg-gray-00 p-4">
          <div className="flex gap-2">
            <Typography variant="me3" className="text-gray-09 font-semibold shrink-0">
              {label1}형
            </Typography>
            <Typography variant="me3" className="text-gray-07">
              {description1}
            </Typography>
          </div>
          <div className="flex gap-2">
            <Typography variant="me3" className="text-point font-semibold shrink-0">
              {label2}형
            </Typography>
            <Typography variant="me3" className="text-gray-07">
              {description2}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}
