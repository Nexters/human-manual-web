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
import { useMyResultStore } from "@/stores/myResultStore";

const INVALID_CODE_MESSAGE = "코드를 다시 입력해주세요";
const LOAD_FAIL_MESSAGE = "케미 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요";

type FriendCodeCheckModalProps = {
  /** 링크로 물고 들어온 친구 코드. 형식 검증은 useFriendCode 단계에서 이미 끝났다. */
  friendCode: string;
  /** 궁합 조회가 성공한 뒤에만 불린다. 입력받은 내 코드를 넘긴다. */
  onCheckCompatibility: (myCode: string) => void;
};

// ------- 친구 초대 링크로 들어온 사람의 "이미 테스트 했다면?" 모달 ------
// 친구 코드는 URL(?friend=)에 이미 있으니 내 코드 하나만 받는다.
// 검증·조회 흐름은 TestStartModal 의 케미 경로와 동일하다(입력이 한 칸일 뿐).
export default function FriendCodeCheckModal({
  friendCode,
  onCheckCompatibility,
}: FriendCodeCheckModalProps) {
  const queryClient = useQueryClient();
  // 이 브라우저에서 테스트를 마쳤다면 코드를 이미 알고 있다. 다시 묻지 않고 채워준다.
  const savedResultCode = useMyResultStore((state) => state.resultCode);
  const [myCode, setMyCode] = useState(savedResultCode ?? "");
  const [myCodeInvalid, setMyCodeInvalid] = useState(false);
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
    setMyCodeInvalid(!mineFormatValid);
    setLoadFailed(false);
    if (!mineFormatValid) return;
    // friend 는 useFriendCode 가 형식 검증을 마친 값이라 여기서 다시 막지 않는다.

    setChecking(true);
    try {
      // 궁합 조회가 성공할 때까지 모달에 머문다. 캐시에 담아두면 이동 직후 바로 렌더된다.
      await queryClient.fetchQuery({
        queryKey: compatibilityQueryKey(mine, friend),
        queryFn: () => getCompatibility(mine, friend),
      });
      onCheckCompatibility(mine);
    } catch {
      // 궁합 API 는 어느 코드가 없는 코드인지 알려주지 않아, 실패했을 때만 확인한다.
      // 친구 코드는 못 고치는 값이라, 내 코드만 개별로 가리고 나머지는 일반 재시도로 안내한다.
      const mineExists = await verifyResultCode(mine);
      setMyCodeInvalid(!mineExists);
      if (mineExists) setLoadFailed(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    // Figma(2929:17192): 카드 350x211, 좌측정렬. 제목 h1(24), 서브 me2(16),
    // 제목→서브 gap ~8, 서브→인풋 ~40, 인풋/확인 h56.
    <div className="flex w-full flex-col items-stretch">
      <Typography variant="h1" className="text-gray-08 text-center">
        이미 테스트 하셨다면?
      </Typography>
      <Typography variant="me2" className="text-gray-05 mt-2 text-center">
        내 코드를 입력하면 궁합을 볼 수 있어요
      </Typography>

      <div className="mt-10 flex w-full items-start gap-[10px]">
        <div className="flex flex-1 flex-col gap-[6px]">
          <TextField
            placeholder="내 코드 입력하기"
            value={myCode}
            onChange={(e) => {
              setMyCode(e.target.value);
              setMyCodeInvalid(false);
              setLoadFailed(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCheckCompatibility();
            }}
            className="placeholder:text-gray-04 h-[56px] border-[1.5px] px-4 text-[18px] font-semibold placeholder:font-semibold"
          />
          {myCodeInvalid && <FieldError message={INVALID_CODE_MESSAGE} />}
          {loadFailed && <FieldError message={LOAD_FAIL_MESSAGE} />}
        </div>

        <button
          type="button"
          disabled={!canCheck || checking}
          onClick={() => void handleCheckCompatibility()}
          className="bg-gray-02 flex h-[56px] w-[82px] shrink-0 items-center justify-center rounded-[10px] transition-opacity disabled:opacity-40"
        >
          {checking ? (
            <Spinner className="size-6" />
          ) : (
            <Typography variant="sb3" as="span" className="text-gray-07">
              확인
            </Typography>
          )}
        </button>
      </div>
    </div>
  );
}
