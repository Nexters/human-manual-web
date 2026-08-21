import Typography from "@/components/shared/Typography";

type FriendChemiTestModalProps = {
  message: string;
  onShare: () => void;
};

export default function FriendChemiTestModal({ message, onShare }: FriendChemiTestModalProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Typography variant="me2" className="text-gray-06 -mt-5">
        친구에게 공유하고 우리 케미 알아보기
      </Typography>

      {/* 보낼 문구를 그대로 보여주기만 하는 영역이라 편집은 막아둔다. */}
      <textarea
        readOnly
        value={message}
        aria-label="친구에게 보낼 문구"
        className="bg-gray-00 border-gray-02 text-gray-06 h-[158px] w-full resize-none rounded-[10px] border px-[18px] py-[17px] text-[16px] leading-[1.5] font-medium tracking-[-0.64px] focus:outline-none"
      />

      <button
        type="button"
        onClick={onShare}
        className="bg-main mt-2 flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
      >
        <Typography variant="h2" as="span">
          복사 후 친구에게 공유
        </Typography>
      </button>
    </div>
  );
}
