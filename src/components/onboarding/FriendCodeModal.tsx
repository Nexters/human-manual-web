import { useState } from "react";
import Typography from "@/components/shared/Typography";
import TextField from "@/components/shared/TextField";

type FriendCodeModalProps = {
  onStartTest: () => void;
  onCheckCode: (myCode: string) => void;
};

export default function FriendCodeModal({ onStartTest, onCheckCode }: FriendCodeModalProps) {
  const [myCode, setMyCode] = useState("");

  const handleCheckCompatibility = () => {
    if (!myCode.trim()) return;
    onCheckCode(myCode.trim());
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Typography variant="sb3" className="text-gray-06 -mt-5">
        4분이면 내 성향을 알아볼 수 있어요
      </Typography>

      <button
        type="button"
        onClick={onStartTest}
        className="bg-sub-4 h-[54px] w-full rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
      >
        <Typography variant="h2" as="span">
          테스트 시작하기
        </Typography>
      </button>

      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full items-center gap-3">
          <span className="bg-gray-03 h-px flex-1" />
          <Typography variant="sb3" className="text-gray-08 shrink-0">
            이미 테스트 하셨다면?
          </Typography>
          <span className="bg-gray-03 h-px flex-1" />
        </div>
        <Typography variant="me2" className="text-gray-05">
          내 코드를 입력하면 궁합을 볼 수 있어요
        </Typography>

        <div className="flex w-full gap-2">
          <TextField
            placeholder="내 코드 입력하기"
            value={myCode}
            onChange={(e) => setMyCode(e.target.value)}
            className="h-14 flex-1 text-center"
          />
          <button
            type="button"
            disabled={!myCode.trim()}
            onClick={handleCheckCompatibility}
            className="bg-gray-02 text-gray-07 h-14 w-[82px] shrink-0 rounded-[10px] transition-opacity disabled:opacity-40"
          >
            <Typography variant="sb3" as="span">
              확인
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
}
