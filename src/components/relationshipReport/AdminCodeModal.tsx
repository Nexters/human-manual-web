import { useState } from "react";
import Typography from "@/components/shared/Typography";
import TextField from "@/components/shared/TextField";

type AdminCodeModalProps = {
  onSubmit: (code: string) => void;
};

// ------- 결제 연동 전 임시 관문: 관리자 비밀번호(베타 코드) 입력 ------
// 코드가 맞는지는 설명서 생성 API 가 403 으로 알려준다. 여기선 받기만 한다.
export default function AdminCodeModal({ onSubmit }: AdminCodeModalProps) {
  const [code, setCode] = useState("");
  const value = code.trim();

  const submit = () => {
    if (value) onSubmit(value);
  };

  return (
    <div className="flex w-full flex-col items-stretch">
      <Typography variant="me2" className="text-gray-06 text-center break-keep">
        결제 연동 전까지는 관리자 비밀번호로
        <br />
        설명서를 만들 수 있어요
      </Typography>

      <TextField
        type="password"
        autoComplete="off"
        placeholder="관리자 비밀번호"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="placeholder:text-gray-04 mt-6 h-[56px] border-[1.5px] px-4 text-[18px] font-semibold caret-auto placeholder:font-semibold"
      />

      <button
        type="button"
        disabled={!value}
        onClick={submit}
        className="bg-sub-4 mt-6 flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Typography variant="h2" as="span">
          확인
        </Typography>
      </button>
    </div>
  );
}
