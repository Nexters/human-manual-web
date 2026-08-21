import { useState } from "react";
import Typography from "@/components/shared/Typography";
import TextField from "@/components/shared/TextField";
import FieldError from "@/components/shared/FieldError";
import Spinner from "@/components/shared/Spinner";
import { verifyResultCode } from "@/api/assessment";
import { isResultCode } from "@/lib/resultCode";

const INVALID_CODE_MESSAGE = "코드를 다시 입력해주세요";

type MyResultModalProps = {
  onOpenResult: (resultCode: string) => void;
};

// ------- 내 결과지 다시 보기 모달 ------
// 결과 코드가 결과지에 닿는 유일한 열쇠라, 다른 기기에서 오거나 스토리지를 잃은 사람에게는
// 코드를 직접 넣는 길이 있어야 한다. 존재를 확인한 뒤에만 이동해서 빈 결과지를 열지 않는다.
export default function MyResultModal({ onOpenResult }: MyResultModalProps) {
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [checking, setChecking] = useState(false);

  const trimmed = code.trim();

  const handleOpenResult = async () => {
    if (trimmed === "" || checking) return;

    // 사용자가 직접 입력한 값은 형식부터 걸러서, 코드가 아닌 문자열을 API 로 보내지 않는다.
    if (!isResultCode(trimmed)) {
      setInvalid(true);
      return;
    }

    setChecking(true);
    try {
      const exists = await verifyResultCode(trimmed);
      if (!exists) {
        setInvalid(true);
        return;
      }
      onOpenResult(trimmed);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Typography variant="sb3" className="text-gray-06 -mt-5 text-center break-keep">
        결과 코드를 입력하면
        <br />내 장난감 설명서를 다시 볼 수 있어요
      </Typography>

      <div className="flex w-full flex-col gap-[6px]">
        <TextField
          placeholder="내 코드 입력하기"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setInvalid(false);
          }}
          className="placeholder:text-gray-04 h-14 text-center placeholder:font-semibold"
        />
        {invalid && <FieldError message={INVALID_CODE_MESSAGE} />}
      </div>

      <button
        type="button"
        disabled={trimmed === "" || checking}
        onClick={handleOpenResult}
        className="bg-main flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity disabled:opacity-40"
      >
        {checking ? (
          <Spinner className="size-6" />
        ) : (
          <Typography variant="h2" as="span">
            내 결과지 보러가기
          </Typography>
        )}
      </button>
    </div>
  );
}
