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
const SAME_CODE_MESSAGE = "내 코드와 다른 친구 코드를 입력해주세요";
const LOAD_FAIL_MESSAGE = "케미 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요";

interface FriendCodeChemiFormProps {
  myCode: string;
  /** 궁합 조회가 성공한 뒤에만 불린다. */
  onCheckCompatibility: (friendCode: string) => void;
}

// ------- 친구 코드로 바로 케미 보기 UI ------
// 검증·조회 흐름은 FriendCodeCheckModal 과 같고, 받는 값이 내 코드 대신 친구 코드다.
export default function FriendCodeChemiForm({
  myCode,
  onCheckCompatibility,
}: FriendCodeChemiFormProps) {
  const queryClient = useQueryClient();
  const [friendCode, setFriendCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [sameCode, setSameCode] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [checking, setChecking] = useState(false);

  const friend = friendCode.trim();

  const handleCheck = async () => {
    if (friend === "" || checking) return;

    const formatValid = isResultCode(friend);
    setInvalid(!formatValid);
    setLoadFailed(false);
    if (!formatValid) return;

    // 서버는 두 코드가 같아도 자기 자신과의 궁합을 돌려주므로 여기서 막는다.
    if (friend === myCode) {
      setSameCode(true);
      return;
    }

    setChecking(true);
    try {
      await queryClient.fetchQuery({
        queryKey: compatibilityQueryKey(myCode, friend),
        queryFn: () => getCompatibility(myCode, friend),
      });
      onCheckCompatibility(friend);
    } catch {
      // 궁합 API 는 어느 코드가 없는지 알려주지 않아, 실패했을 때만 친구 코드를 확인한다.
      const friendExists = await verifyResultCode(friend);
      setInvalid(!friendExists);
      if (friendExists) setLoadFailed(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <Typography variant="sb4" className="text-gray-07">
        친구 코드로 바로 케미 보기
      </Typography>
      <div className="flex w-full items-start gap-[10px]">
        <div className="flex flex-1 flex-col gap-[6px]">
          <TextField
            placeholder="친구 코드 입력하기"
            value={friendCode}
            onChange={(e) => {
              setFriendCode(e.target.value);
              setInvalid(false);
              setSameCode(false);
              setLoadFailed(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCheck();
            }}
            className="placeholder:text-gray-04 h-[56px] border-[1.5px] px-4 text-[18px] font-semibold placeholder:font-semibold"
          />
          {invalid && <FieldError message={INVALID_CODE_MESSAGE} />}
          {sameCode && <FieldError message={SAME_CODE_MESSAGE} />}
          {loadFailed && <FieldError message={LOAD_FAIL_MESSAGE} />}
        </div>

        <button
          type="button"
          disabled={friend === "" || checking}
          onClick={() => void handleCheck()}
          className="bg-gray-02 flex h-[56px] w-[82px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {checking ? (
            <Spinner className="size-6" />
          ) : (
            <Typography variant="sb3" as="span" className="text-gray-07">
              보기
            </Typography>
          )}
        </button>
      </div>
    </div>
  );
}
