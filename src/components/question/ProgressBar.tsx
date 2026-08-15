import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type ProgressBarProps = {
  current: number;
  total: number;
  onSeek?: (order: number) => void;
  maxOrder?: number;
};

const ProgressBar = ({ current, total, onSeek, maxOrder }: ProgressBarProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastSeeked = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const percent = Math.min(100, Math.max(0, (current / total) * 100));
  const limit = maxOrder ?? total;

  const orderFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return current;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.min(limit, Math.max(1, Math.ceil(ratio * total)));
  };

  const seek = (clientX: number) => {
    if (!onSeek) return;
    const next = orderFromClientX(clientX);
    if (next === lastSeeked.current) return;
    lastSeeked.current = next;
    onSeek(next);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    lastSeeked.current = null;
    seek(event.clientX);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    seek(event.clientX);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    lastSeeked.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    if (event.key === "ArrowLeft" && current > 1) onSeek(current - 1);
    if (event.key === "ArrowRight" && current < limit) onSeek(current + 1);
  };

  return (
    <div>
      <div
        ref={trackRef}
        role={onSeek ? "slider" : "progressbar"}
        aria-label={onSeek ? "문항 이동" : undefined}
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        tabIndex={onSeek ? 0 : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-[9px] w-full rounded-[10px]",
          onSeek && "-my-3 box-content cursor-pointer touch-none py-3",
        )}
      >
        <div className="bg-gray-01 h-full overflow-hidden rounded-[10px]">
          <div
            className={cn(
              "bg-point h-full rounded-[10px]",
              !dragging && "transition-[width] duration-300",
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <Typography variant="me2" className="text-gray-04 mt-[49px]">
        {current}/{total}
      </Typography>
    </div>
  );
};

export default ProgressBar;
