import { useState } from "react";
import Typography from "@/components/shared/Typography";
import Spinner from "@/components/shared/Spinner";
import TextField from "@/components/shared/TextField";
import FieldError from "@/components/shared/FieldError";

type NextChemiCardProps = {
  /** 이 브라우저에서 테스트를 마친 사람의 장난감 이미지. 없으면 물음표 자리로 둔다. */
  myImageUrl?: string;
  onCopyMyChemiLink: () => void;
  onStartTest: () => void;
  onEnterCode: () => void;
  /**
   * 입력받은 친구 코드로 그 친구와의 케미로 넘어간다.
   * 성공하면 이 화면을 떠나므로 null, 실패하면 인풋에 띄울 메시지를 돌려준다.
   */
  onCheckFriendChemi: (friendCode: string) => Promise<string | null>;
};

const TOY_SLOT = "flex size-[72px] items-center justify-center rounded-[18px]";

// ------- 케미 페이지 하단, 다음 케미로 가는 카드 ------
// 케미 페이지 URL 에는 코드 두 개가 실려 있어서, 이 화면은 루프의 분기점이다. 그런데
// 열람자가 누구인지는 URL 로 알 수 없다 — 당사자 둘 중 하나일 수도, 단톡에서 링크를
// 받은 제3자일 수도 있다.
//
// 이름 두 개를 주고 "누가 당신인가요" 를 고르게 하는 안은 쓰지 않는다. 제3자를 담지 못하고,
// 잘못 고르면 남의 코드가 링크에 박혀 나간다(결과지에서 겪은 것과 같은 종류의 버그다).
// 대신 이 브라우저에 저장된 결과 코드 하나로만 판단한다 — 있으면 그 사람이 나다.
export default function NextChemiCard({
  myImageUrl,
  onCopyMyChemiLink,
  onStartTest,
  onEnterCode,
  onCheckFriendChemi,
}: NextChemiCardProps) {
  const hasMyCode = Boolean(myImageUrl);

  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [friendCodeError, setFriendCodeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitFriendCode = async () => {
    if (friendCodeInput.trim() === "" || submitting) return;

    setSubmitting(true);
    try {
      setFriendCodeError(await onCheckFriendChemi(friendCodeInput));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white p-5">
      <div className="flex flex-col items-center gap-1 text-center">
        <Typography variant="sb3" className="text-gray-09">
          {hasMyCode ? "다른 친구랑도 케미 보기" : "나도 테스트하고 케미 보기"}
        </Typography>
        <Typography variant="me3" className="text-gray-06 break-keep">
          {hasMyCode
            ? "링크를 보내면, 친구 화면에서 케미가 열려요."
            : "테스트를 마치면 친구와의 케미를 볼 수 있어요."}
        </Typography>
      </div>

      {/* × 는 이름줄까지 포함한 세로 가운데가 아니라 장난감 카드의 가운데에 맞춘다. */}
      <div className="flex items-start justify-center gap-4 py-1">
        <div className="flex flex-col items-center gap-[10px]">
          {hasMyCode ? (
            <div className={`${TOY_SLOT} bg-gray-01`}>
              <img src={myImageUrl} alt="" className="size-12 object-contain" />
            </div>
          ) : (
            <div className={`${TOY_SLOT} border-gray-03 border-2 border-dashed`}>
              <Typography variant="h1" as="span" className="text-gray-04">
                ?
              </Typography>
            </div>
          )}
          <Typography variant="sb4" className={hasMyCode ? "text-gray-09" : "text-gray-04"}>
            나
          </Typography>
        </div>

        <div className="flex h-[72px] items-center">
          <Typography variant="me2" as="span" className="text-gray-04">
            ×
          </Typography>
        </div>

        <div className="flex flex-col items-center gap-[10px]">
          <div className={`${TOY_SLOT} border-gray-03 border-2 border-dashed`}>
            <Typography variant="h1" as="span" className="text-gray-04">
              ?
            </Typography>
          </div>
          <Typography variant="sb4" className="text-gray-04">
            친구
          </Typography>
        </div>
      </div>

      <button
        type="button"
        onClick={hasMyCode ? onCopyMyChemiLink : onStartTest}
        className="bg-sub-4 flex h-[54px] w-full items-center justify-center rounded-[15px] text-white transition-opacity hover:opacity-90 active:opacity-80"
      >
        <Typography variant="h3" as="span">
          {hasMyCode ? "내 케미 링크 복사하기" : "테스트 시작하기"}
        </Typography>
      </button>

      {/* 이 페이지의 두 사람이 아닌 다른 친구와도 바로 볼 수 있어야 한다. 내 코드는
          이미 알고 있으니 상대 코드 하나만 받는다. 초대는 아직 안 한 친구용, 이쪽은
          이미 마친 친구용이라 경계를 문장으로 밝혀둔다. */}
      {hasMyCode && (
        <>
          <div className="flex w-full items-center gap-3">
            <span className="bg-gray-02 h-px flex-1" />
            <Typography variant="me4" className="text-gray-05 shrink-0">
              이미 테스트한 친구라면
            </Typography>
            <span className="bg-gray-02 h-px flex-1" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex flex-1 flex-col gap-[6px]">
                <TextField
                  placeholder="친구 코드 입력"
                  value={friendCodeInput}
                  onChange={(e) => {
                    setFriendCodeInput(e.target.value);
                    setFriendCodeError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSubmitFriendCode();
                  }}
                  className="h-[54px] text-[16px]"
                />
                {friendCodeError && <FieldError message={friendCodeError} />}
              </div>
              <button
                type="button"
                disabled={friendCodeInput.trim() === "" || submitting}
                onClick={() => void handleSubmitFriendCode()}
                className="bg-sub-5 text-sub-4 flex h-[54px] shrink-0 items-center justify-center rounded-[10px] px-5 transition-opacity disabled:opacity-40"
              >
                {submitting ? (
                  <Spinner className="size-5" />
                ) : (
                  <Typography variant="sb3" as="span">
                    케미 보기
                  </Typography>
                )}
              </button>
            </div>
            <Typography variant="me4" className="text-gray-05 break-keep">
              내 코드는 자동으로 채워져요 — 친구 코드만 있으면 돼요
            </Typography>
          </div>
        </>
      )}

      {/* 코드가 없는 사람에게만 남겨두는 우회로. 다른 기기에서 테스트를 이미 마친 경우다. */}
      {!hasMyCode && (
        <button type="button" onClick={onEnterCode} className="flex justify-center">
          <Typography variant="me3" as="span" className="text-gray-05 underline">
            이미 했어요 - 내 코드 입력하기
          </Typography>
        </button>
      )}
    </div>
  );
}
