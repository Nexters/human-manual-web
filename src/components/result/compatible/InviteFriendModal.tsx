import Typography from "@/components/shared/Typography";
import CopyIcon from "@/components/shared/icons/CopyIcon";

interface InviteFriendModalProps {
  code: string;
  onCopy: () => void;
}

export default function InviteFriendModal({ code, onCopy }: InviteFriendModalProps) {
  return (
    <div className="flex flex-col items-center gap-[5px] text-center">
      <Typography variant="h1" className="text-gray-09">
        친구 추가
      </Typography>
      <Typography variant="sb3" className="text-gray-06">
        친구에게 내 코드를 공유해보세요
      </Typography>

      <button
        type="button"
        onClick={onCopy}
        className="mt-[26px] flex h-[41px] w-[158px] items-center justify-center gap-1 rounded-[10px] bg-gray-01"
      >
        <Typography variant="sb3" className="text-gray-08">
          {code}
        </Typography>
        <CopyIcon className="size-5 text-gray-05" />
      </button>
    </div>
  );
}
