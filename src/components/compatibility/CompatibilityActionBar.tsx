import Typography from "@/components/shared/Typography";
import DownloadIcon from "@/components/compatibility/icons/DownloadIcon";
import ShareIcon from "@/components/compatibility/icons/ShareIcon";
import { cn } from "@/lib/cn";

type CompatibilityActionBarProps = {
  onSave?: () => void;
  onShare?: () => void;
  className?: string;
};

export default function CompatibilityActionBar({
  onSave,
  onShare,
  className,
}: CompatibilityActionBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 flex gap-2 bg-gradient-to-b from-white/0 to-white to-30% px-5 pt-8 pb-5",
        className,
      )}
    >
      <button
        type="button"
        onClick={onSave}
        className="bg-gray-02 text-gray-04 inline-flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[15px] transition-opacity hover:opacity-90 active:opacity-80"
      >
        <DownloadIcon className="size-6" />
        <Typography variant="sb3" as="span">
          이미지 저장
        </Typography>
      </button>
      <button
        type="button"
        onClick={onShare}
        className="bg-main inline-flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[15px] text-white transition-opacity hover:opacity-90 active:opacity-80"
      >
        <ShareIcon className="size-6" />
        <Typography variant="sb3" as="span">
          결과지 공유
        </Typography>
      </button>
    </div>
  );
}
