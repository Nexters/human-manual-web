import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Typography from "@/components/shared/Typography";
import TextField from "@/components/shared/TextField";
import FieldError from "@/components/shared/FieldError";
import Spinner from "@/components/shared/Spinner";
import { verifyResultCode } from "@/api/assessment";
import { getCompatibility } from "@/api/compatibility";
import { compatibilityQueryKey } from "@/hooks/useCompatibility";
import { isResultCode } from "@/lib/resultCode";
import { cn } from "@/lib/cn";

const INVALID_CODE_MESSAGE = "코드를 다시 입력해주세요";
const LOAD_FAIL_MESSAGE = "케미 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요";

type FriendCodeModalProps = {
  friendCode: string;
  onStartTest: () => void;
  onCheckCode: (myCode: string) => void;
};

export default function FriendCodeModal({
  friendCode,
  onStartTest,
  onCheckCode,
}: FriendCodeModalProps) {
  const queryClient = useQueryClient();
  const [myCode, setMyCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [checking, setChecking] = useState(false);

  const mine = myCode.trim();
  const canCheck = mine !== "";

  const handleCheckCompatibility = async () => {
    if (!canCheck || checking) return;

    // 사용자가 직접 입력한 값은 형식부터 걸러서, 코드가 아닌 문자열을 API 로 보내지 않는다.
    setLoadFailed(false);
    if (!isResultCode(mine)) {
      setInvalid(true);
      return;
    }

    setChecking(true);
    try {
      // 궁합 조회가 성공할 때까지 모달에 머문다. 캐시에 담아두면 이동 직후 바로 렌더된다.
      await queryClient.fetchQuery({
        queryKey: compatibilityQueryKey(mine, friendCode),
        queryFn: () => getCompatibility(mine, friendCode),
      });
      onCheckCode(mine);
    } catch {
      // 친구 코드는 링크로 받은 값이라 사용자가 손댈 수 없다. 내 코드가 없는 경우와
      // 그 밖의 실패를 구분해서 안내한다.
      const mineExists = await verifyResultCode(mine);

      setInvalid(!mineExists);
      setLoadFailed(mineExists);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Typography variant="sb3" className="text-gray-06 -mt-5">
        3분이면 내 성향을 알아볼 수 있어요
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
          내 코드를 입력하면 케미를 볼 수 있어요
        </Typography>

        <div className="flex w-full flex-col gap-[6px]">
          <div className="flex w-full gap-2">
            <TextField
              placeholder="내 코드 입력하기"
              value={myCode}
              onChange={(e) => {
                setMyCode(e.target.value);
                setInvalid(false);
                setLoadFailed(false);
              }}
              className="placeholder:text-gray-04 h-14 flex-1 text-center placeholder:font-semibold"
            />
            <button
              type="button"
              disabled={!canCheck || checking}
              onClick={handleCheckCompatibility}
              className={cn(
                "flex h-14 w-[82px] shrink-0 items-center justify-center rounded-[10px] transition-colors",
                // 입력 전에는 회색, 코드를 입력하면 눌릴 수 있다는 걸 색으로 알린다.
                canCheck ? "bg-main text-white" : "bg-gray-02 text-gray-07",
              )}
            >
              {checking ? (
                <Spinner className="size-5" />
              ) : (
                <Typography variant="sb3" as="span">
                  확인
                </Typography>
              )}
            </button>
          </div>

          {invalid && <FieldError message={INVALID_CODE_MESSAGE} />}
          {loadFailed && <FieldError message={LOAD_FAIL_MESSAGE} />}
        </div>
      </div>
    </div>
  );
}
