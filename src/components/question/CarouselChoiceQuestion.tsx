import { useState, type PointerEvent as ReactPointerEvent } from "react";
import CarouselArrow from "@/components/question/CarouselArrow";
import SpeechBubble from "@/components/question/SpeechBubble";
import AssetImage from "@/components/shared/AssetImage";
import Typography from "@/components/shared/Typography";
import { characterAsset } from "@/constants/assets";
import type { CarouselOption } from "@/constants/questions";
import { cn } from "@/lib/cn";

const DRAG_SLOP = 8;
const SWIPE_THRESHOLD = 50;
const EDGE_RESISTANCE = 0.25;

type CarouselChoiceQuestionProps = {
  options: CarouselOption[];
  index: number;
  onIndexChange: (index: number) => void;
};

const CarouselChoiceQuestion = ({ options, index, onIndexChange }: CarouselChoiceQuestionProps) => {
  const [drag, setDrag] = useState<{ startX: number; dx: number } | null>(null);

  const active = options[index];
  const atStart = index === 0;
  const atEnd = index === options.length - 1;

  const dx = drag?.dx ?? 0;
  const blocked = (dx > 0 && atStart) || (dx < 0 && atEnd);
  const swipeStyle = { transform: `translateX(${blocked ? dx * EDGE_RESISTANCE : dx}px)` };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setDrag({ startX: event.clientX, dx: 0 });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const moved = event.clientX - drag.startX;
    if (Math.abs(moved) > DRAG_SLOP && !event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setDrag({ startX: drag.startX, dx: moved });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const moved = drag.dx;
    setDrag(null);

    if (moved <= -SWIPE_THRESHOLD && !atEnd) onIndexChange(index + 1);
    else if (moved >= SWIPE_THRESHOLD && !atStart) onIndexChange(index - 1);
  };

  return (
    <div
      className="flex flex-1 touch-pan-y flex-col items-center select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div
            style={swipeStyle}
            className={cn(
              "flex flex-col items-center",
              !drag && "transition-transform duration-200",
            )}
          >
            <SpeechBubble className="mt-[37px]">{active.quote}</SpeechBubble>
            <AssetImage
              src={characterAsset(active.characterId)}
              alt={active.name}
              className="pointer-events-none mt-[21px] h-[280px] w-[250px]"
            />
            <Typography variant="h2" className="mt-[5px] text-black">
              {active.name}
            </Typography>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[92px] flex h-[280px] items-center justify-between">
          <CarouselArrow
            direction="prev"
            disabled={atStart}
            onClick={() => onIndexChange(index - 1)}
          />
          <CarouselArrow
            direction="next"
            disabled={atEnd}
            onClick={() => onIndexChange(index + 1)}
          />
        </div>
      </div>

      <div className="mt-[29px] flex items-center gap-[4px]">
        {options.map((option, optionIndex) =>
          optionIndex === index ? (
            <span key={option.value} className="bg-main h-[5px] w-[11px] rounded-[2.5px]" />
          ) : (
            <span key={option.value} className="size-[7px] rounded-full bg-dot-off" />
          ),
        )}
      </div>
    </div>
  );
};

export default CarouselChoiceQuestion;
