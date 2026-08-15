import { cn } from "@/lib/cn";

type CarouselArrowProps = {
  direction: "prev" | "next";
  disabled?: boolean;
  onClick: () => void;
  className?: string;
};

const CarouselArrow = ({ direction, disabled = false, onClick, className }: CarouselArrowProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "이전 선택지" : "다음 선택지"}
      className={cn("size-[40px] shrink-0", className)}
    >
      <svg viewBox="0 0 40 40" fill="none" className="size-full">
        <circle cx="20" cy="20" r="20" className={disabled ? "fill-gray-03" : "fill-gray-07"} />
        <path
          d="M27 18.268C28.3333 19.0378 28.3333 20.9623 27 21.7321L18 26.9282C16.6667 27.698 15 26.7358 15 25.1962L15 14.8039C15 13.2643 16.6667 12.302 18 13.0718L27 18.268Z"
          className={disabled ? "fill-gray-01" : "fill-white"}
          transform={direction === "prev" ? "rotate(180 20 20)" : undefined}
        />
      </svg>
    </button>
  );
};

export default CarouselArrow;
