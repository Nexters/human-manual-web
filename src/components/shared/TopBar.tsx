import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import { cn } from "@/lib/cn";

type TopBarProps = {
  title?: string;
  onBack?: () => void;
  className?: string;
};

export default function TopBar({ title, onBack, className }: TopBarProps) {
  return (
    <div className={cn("relative flex h-[60px] items-center justify-center px-5", className)}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="text-gray-09 absolute left-5"
        >
          <ChevronLeftIcon className="size-[30px]" />
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
