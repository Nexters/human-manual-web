import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import Typography from "@/components/shared/Typography";

type HeroTopBarProps = {
  title: string;
  onBack: () => void;
};

export default function HeroTopBar({ title, onBack }: HeroTopBarProps) {
  return (
    <div className="fixed top-0 left-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 bg-transparent">
      <div className="relative flex h-[60px] items-center justify-center px-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="absolute left-5 flex size-[30px] items-center justify-center text-white"
        >
          <ChevronLeftIcon className="h-[24px] w-[14px]" />
        </button>
        <Typography variant="h2" as="span" className="text-white">
          {title}
        </Typography>
      </div>
    </div>
  );
}
