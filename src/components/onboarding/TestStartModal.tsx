import { useState } from "react";
import Typography from "@/components/shared/Typography";
import TextField from "@/components/shared/TextField";

type TestStartModalProps = {
  initialFriendCode?: string;
  onStartTest: () => void;
  onCheckCompatibility: (myCode: string, friendCode: string) => void;
};

export default function TestStartModal({
  initialFriendCode,
  onStartTest,
  onCheckCompatibility,
}: TestStartModalProps) {
  const [myCode, setMyCode] = useState("");
  const [friendCode, setFriendCode] = useState(initialFriendCode ?? "");

  const canCheck = myCode.trim() !== "" && friendCode.trim() !== "";

  const handleCheckCompatibility = () => {
    if (!canCheck) return;
    onCheckCompatibility(myCode.trim(), friendCode.trim());
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
          코드를 입력하면 궁합을 볼 수 있어요
        </Typography>

        <div className="flex w-full flex-col gap-2">
          <TextField
            placeholder="내 코드 입력하기"
            value={myCode}
            onChange={(e) => setMyCode(e.target.value)}
            className="h-14 text-center"
          />
          <TextField
            placeholder="친구 코드 입력하기"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            className="h-14 text-center"
          />
        </div>

        <button
          type="button"
          disabled={!canCheck}
          onClick={handleCheckCompatibility}
          className="bg-main h-[54px] w-full rounded-[10px] text-white transition-opacity disabled:opacity-40"
        >
          <Typography variant="h2" as="span">
            케미 결과 확인하기
          </Typography>
        </button>
      </div>
    </div>
  );
}
