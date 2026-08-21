import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import { cn } from "@/lib/cn";

type TopBarProps = {
  title?: string;
  onBack?: () => void;
  className?: string;
};

export default function TopBar({ title, onBack, className }: TopBarProps) {
  return (
    <div
      className={cn(
        "bg-white sticky top-0 z-10 flex h-[60px] items-center justify-center px-5",
        className,
      )}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="text-gray-09 absolute left-5 flex size-[30px] items-center justify-center"
        >
          <ChevronLeftIcon className="w-[10px]" />
        </button>
      )}
      {title && (
        <span className="text-[20px] leading-[1.5] font-bold tracking-[-0.8px] text-gray-09">
          {title}
        </span>
      )}
    </div>
  );
}
