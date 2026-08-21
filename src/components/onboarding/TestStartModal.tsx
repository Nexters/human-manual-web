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

const INVALID_CODE_MESSAGE = "코드를 다시 입력해주세요";
const LOAD_FAIL_MESSAGE = "케미 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요";

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
  const queryClient = useQueryClient();
  const [myCode, setMyCode] = useState("");
  const [friendCode, setFriendCode] = useState(initialFriendCode ?? "");
  const [myCodeInvalid, setMyCodeInvalid] = useState(false);
  const [friendCodeInvalid, setFriendCodeInvalid] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [checking, setChecking] = useState(false);

  const mine = myCode.trim();
  const friend = friendCode.trim();
  // 서버는 mine 과 friend 가 같아도 200 으로 자기 자신과의 궁합을 돌려주므로 여기서 막는다.
  const canCheck = mine !== "" && friend !== "" && mine !== friend;

  const handleCheckCompatibility = async () => {
    if (!canCheck || checking) return;

    // 사용자가 직접 입력한 값은 형식부터 걸러서, 코드가 아닌 문자열을 API 로 보내지 않는다.
    const mineFormatValid = isResultCode(mine);
    const friendFormatValid = isResultCode(friend);
    setMyCodeInvalid(!mineFormatValid);
    setFriendCodeInvalid(!friendFormatValid);
    setLoadFailed(false);
    if (!mineFormatValid || !friendFormatValid) return;

    setChecking(true);
    try {
      // 궁합 조회가 성공할 때까지 모달에 머문다. 캐시에 담아두면 이동 직후 바로 렌더된다.
      await queryClient.fetchQuery({
        queryKey: compatibilityQueryKey(mine, friend),
        queryFn: () => getCompatibility(mine, friend),
      });
      onCheckCompatibility(mine, friend);
    } catch {
      // 궁합 API 는 어느 코드가 없는 코드인지 알려주지 않아, 실패했을 때만 개별로 가린다.
      const [mineExists, friendExists] = await Promise.all([
        verifyResultCode(mine),
        verifyResultCode(friend),
      ]);
      setMyCodeInvalid(!mineExists);
      setFriendCodeInvalid(!friendExists);
      if (mineExists && friendExists) setLoadFailed(true);
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
          코드를 입력하면 케미를 볼 수 있어요
        </Typography>

        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-[6px]">
            <TextField
              placeholder="내 코드 입력하기"
              value={myCode}
              onChange={(e) => {
                setMyCode(e.target.value);
                setMyCodeInvalid(false);
                setLoadFailed(false);
              }}
              className="placeholder:text-gray-04 h-14 text-center placeholder:font-semibold"
            />
            {myCodeInvalid && <FieldError message={INVALID_CODE_MESSAGE} />}
          </div>

          <div className="flex flex-col gap-[6px]">
            <TextField
              placeholder="친구 코드 입력하기"
              value={friendCode}
              onChange={(e) => {
                setFriendCode(e.target.value);
                setFriendCodeInvalid(false);
                setLoadFailed(false);
              }}
              className="placeholder:text-gray-04 h-14 text-center placeholder:font-semibold"
            />
            {friendCodeInvalid && <FieldError message={INVALID_CODE_MESSAGE} />}
          </div>
        </div>

        {loadFailed && <FieldError message={LOAD_FAIL_MESSAGE} />}

        <button
          type="button"
          disabled={!canCheck || checking}
          onClick={handleCheckCompatibility}
          className="bg-main flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity disabled:opacity-40"
        >
          {checking ? (
            <Spinner className="size-6" />
          ) : (
            <Typography variant="h2" as="span">
              케미 결과 확인하기
            </Typography>
          )}
        </button>
      </div>
    </div>
  );
}
