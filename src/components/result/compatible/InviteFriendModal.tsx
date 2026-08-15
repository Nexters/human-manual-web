import Typography from "@/components/shared/Typography";
import CopyIcon from "@/components/shared/icons/CopyIcon";

interface InviteFriendModalProps {
  code: string;
  onCopy: () => void;
}

export default function InviteFriendModal({ code, onCopy }: InviteFriendModalProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="flex h-[41px] w-[158px] items-center justify-center gap-1 rounded-[10px] bg-gray-01"
    >
      <Typography variant="sb3" className="text-gray-08">
        {code}
      </Typography>
      <CopyIcon className="size-5 text-gray-05" />
    </button>
  );
}
