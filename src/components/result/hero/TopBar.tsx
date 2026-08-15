import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type HeroTopBarProps = {
  title: string;
  onBack: () => void;
  isDark?: boolean;
};

export default function HeroTopBar({ title, onBack, isDark = false }: HeroTopBarProps) {
  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 transition-colors duration-300",
        isDark ? "bg-gray-00" : "bg-transparent",
      )}
    >
      <div className="relative flex h-[60px] items-center justify-center px-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className={cn(
            "absolute left-5 flex size-[30px] items-center justify-center transition-colors duration-300",
            isDark ? "text-gray-09" : "text-white",
          )}
        >
          <ChevronLeftIcon className="h-[24px] w-[14px]" />
        </button>
        <Typography
          variant="h2"
          as="span"
          className={cn("transition-colors duration-300", isDark ? "text-gray-09" : "text-white")}
        >
          {title}
        </Typography>
      </div>
    </div>
  );
}
