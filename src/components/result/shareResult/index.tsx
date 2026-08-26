import { useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@/components/shared/Typography";
import Spinner from "@/components/shared/Spinner";
import TextField from "@/components/shared/TextField";
import FieldError from "@/components/shared/FieldError";
import CopyIcon from "@/components/shared/icons/CopyIcon";
import LinkIcon from "@/components/shared/icons/LinkIcon";
import { useToast } from "@/hooks/useToast";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useTestStore } from "@/stores/testStore";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";

interface ShareResultProps {
  /** 이 결과지 주인의 닉네임. 코드·링크가 누구 것인지 밝히는 데 쓴다. */
  nickname: string;
  /** 이 결과지 주인의 장난감 이미지. 케미 미리보기 왼쪽 자리에 들어간다. */
  imageUrl: string;
  /** 친구 링크로 이어진 상대. 있으면 케미가 준비된 카드가 따로 붙는다. */
  friendNickname?: string;
  friendImageUrl?: string;
  isCheckingChemi: boolean;
  onSendChemiTest: () => void;
  onViewChemi: () => void;
  /**
   * 입력받은 친구 코드로 케미로 보낸다.
   * 성공하면 이 페이지를 떠나므로 null, 실패하면 인풋에 띄울 메시지를 돌려준다.
   */
  onCheckFriendChemi: (friendCode: string) => Promise<string | null>;
}

const TOY_SLOT = "flex size-20 items-center justify-center rounded-[20px]";
const CARD = "flex w-full flex-col gap-4 rounded-[20px] bg-white p-5";

// ------- ShareResult UI ------
// 궁합(Compatible) 데이터와 무관하게 결과 코드(id)만으로 동작하는 공유 UI라 별도 섹션으로 분리했다.
//
// 결과지를 케미 허브로 쓴다. 내 코드는 URL(/result/:id)에 이미 있으니 사용자가 넣을 값은
// 상대 코드 하나뿐이고, 제출하면 곧바로 케미 페이지로 넘긴다. 홈의 팝업처럼 코드를 두 개
// 받게 하면 이미 아는 값을 다시 묻는 셈이 된다.
//
// 코드 보관 카드는 제목·이유·코드를 갖춘 형태를 유지한다. 한 줄로 줄여봤지만 저장해야
// 하는 이유가 사라져 그냥 스쳐 읽혔다. 대신 카드 전체를 핑크로 칠하지 않고 코드 박스만
// 물들여서, 눈이 이 카드에서 멈추더라도 결과지의 다른 흰 카드들과 무게가 같게 뒀다.
//
// 케미 미리보기의 "??%" 는 뺐다. 링크를 보낸 사람 화면은 실제로 채워지지 않는데(서버가 누가
// 내 링크로 들어왔는지 알려주지 않는다) 곧 채워질 것처럼 읽혀서, 기대와 동작이 어긋났다.
export default function ShareResult({
  nickname,
  imageUrl,
  friendNickname,
  friendImageUrl,
  isCheckingChemi,
  onSendChemiTest,
  onViewChemi,
  onCheckFriendChemi,
}: ShareResultProps) {
  const { id } = useParams<{ id: string }>();
  const inviteCode = id ?? "";
  const { open: openToast } = useToast();
  const navigate = useFriendNavigate();
  const resetTest = useTestStore((state) => state.reset);

  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [friendCodeError, setFriendCodeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 남의 결과지를 열었을 수도 있으므로 "내 것" 이라고 부르지 않는다. 주인 이름을 붙여 둔다.
  const ownerLabel = nickname ? `${nickname}님` : "나";
  const hasFriend = Boolean(friendNickname);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
    } catch {
      // 클립보드 권한이 없는 환경에서도 복사 완료 토스트는 그대로 노출
    }
    trackEvent(GA_EVENTS.RESULT.INVITE_CODE_COPY);
    openToast("코드 번호가 복사되었습니다");
  };

  const handleCopyLink = async () => {
    // 결과 코드가 경로에 담긴 실제 결과지 링크를 복사한다.
    const url = new URL(`/result/${inviteCode}`, window.location.origin);

    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {
      // 클립보드 권한이 없는 환경에서도 복사 완료 토스트는 그대로 노출
    }
    trackEvent(GA_EVENTS.RESULT.INVITE_LINK_SHARE);
    openToast("결과지 링크를 복사했어요");
  };

  const handleSubmitFriendCode = async () => {
    if (friendCodeInput.trim() === "" || submitting) return;

    setSubmitting(true);
    try {
      setFriendCodeError(await onCheckFriendChemi(friendCodeInput));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    trackEvent(GA_EVENTS.RESULT.RETRY);
    resetTest();
    navigate("/");
  };

  // ----- 친구 코드 입력 + 케미 보기 -----
  // 케미가 이미 준비된 경우(hasFriend)와 아닌 경우 둘 다 아래쪽에 그대로 붙는다.
  const friendCodeField = (
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
        {ownerLabel} 코드는 자동으로 채워져요 — 친구 코드만 있으면 돼요
      </Typography>
    </div>
  );

  // ----- 아직 테스트하지 않은 친구를 부르는 버튼 -----
  // 케미가 준비된 화면에서는 주역이 아니라서 회색으로 내려둔다.
  const inviteButton = (
    <button
      type="button"
      onClick={onSendChemiTest}
      className={`flex h-[54px] w-full items-center justify-center rounded-[15px] transition-opacity hover:opacity-90 active:opacity-80 ${
        hasFriend ? "bg-gray-01 text-gray-09" : "bg-sub-4 text-white"
      }`}
    >
      <Typography variant="h3" as="span">
        아직 안 한 친구 초대하기
      </Typography>
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-4 px-5 pt-6 pb-8">
      {/* ------- 1. 코드 보관 ------ */}
      {/* 로그인이 없어 이 코드가 결과지·케미에 닿는 유일한 열쇠다. 케미보다 먼저 두고,
          무엇을 못 하게 되는지를 문장으로 밝혀야 사람들이 복사한다. */}
      <div className="ring-sub-5 flex w-full flex-col gap-[14px] rounded-[20px] bg-white p-5 ring-2">
        <div className="flex flex-col gap-1">
          <Typography variant="sb3" className="text-gray-09">
            먼저, 코드를 저장해두세요
          </Typography>
          <Typography variant="me3" className="text-gray-06 break-keep">
            이 코드가 있어야 내 결과지를 다시 보거나 친구와 케미를 볼 수 있어요.
          </Typography>
        </div>

        {/* 카드가 아니라 코드 박스만 물들인다. 강조가 옮겨 적어야 하는 값 한 곳에 붙는다. */}
        <div className="bg-sub-5 flex flex-col gap-1 rounded-[12px] px-4 py-3">
          <Typography variant="me4" className="text-gray-06">
            {ownerLabel} 코드
          </Typography>
          <div className="flex items-center justify-between gap-3">
            {/* 코드를 옮겨 적을 때 l/1·O/0 을 헷갈리지 않도록 고정폭 글꼴을 쓴다. */}
            <span className="text-gray-09 font-mono text-[18px] leading-[1.5] font-semibold tracking-[0.06em]">
              {inviteCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-sub-4 flex shrink-0 items-center gap-1"
            >
              <CopyIcon className="size-4" />
              <Typography variant="sb4" as="span">
                복사
              </Typography>
            </button>
          </div>
        </div>
      </div>

      {/* ------- 2. 이미 준비된 케미 ------ */}
      {/* 친구 링크로 들어와 테스트를 마친 경우에만 붙는다. 여기가 이 화면의 주역이라 링으로 띄운다. */}
      {hasFriend && (
        <div className={`${CARD} ring-sub-4 ring-2`}>
          <div className="flex flex-col gap-1">
            <Typography variant="sb3" className="text-gray-09">
              {friendNickname}님과의 케미가 준비됐어요
            </Typography>
            <Typography variant="me3" className="text-gray-06 break-keep">
              둘 사이 설명서가 만들어졌어요.
            </Typography>
          </div>

          {/* × 는 이름줄까지 포함한 세로 가운데가 아니라 장난감 카드의 가운데에 맞춘다. */}
          <div className="flex items-start justify-center gap-4 py-1">
            <div className="flex flex-col items-center gap-3">
              <div className={`${TOY_SLOT} bg-gray-01`}>
                <img src={imageUrl} alt="" className="size-14 object-contain" />
              </div>
              <Typography variant="sb4" className="text-gray-09">
                {ownerLabel}
              </Typography>
            </div>

            <div className="flex h-20 items-center">
              <Typography variant="me2" as="span" className="text-gray-04">
                ×
              </Typography>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className={`${TOY_SLOT} bg-gray-01`}>
                {friendImageUrl && (
                  <img src={friendImageUrl} alt="" className="size-14 object-contain" />
                )}
              </div>
              <Typography variant="sb4" className="text-gray-09">
                {friendNickname}님
              </Typography>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewChemi}
            disabled={isCheckingChemi}
            className="bg-sub-4 flex h-[54px] w-full items-center justify-center rounded-[15px] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
          >
            {isCheckingChemi ? (
              <Spinner className="size-6" />
            ) : (
              <Typography variant="h3" as="span">
                {friendNickname}님과의 케미 보러가기
              </Typography>
            )}
          </button>
        </div>
      )}

      {/* ------- 3. 다른 친구와 케미 보기 ------ */}
      {/* 케미가 준비된 화면에서는 "한 명 더" 를 권하는 자리, 아닌 화면에서는 케미의 유일한 입구다. */}
      <div className={CARD}>
        <div className="flex flex-col gap-1">
          <Typography variant="sb3" className="text-gray-09">
            {hasFriend ? "다른 친구와도 케미 보기" : "친구와의 케미 보기"}
          </Typography>
          <Typography variant="me3" className="text-gray-06 break-keep">
            {hasFriend
              ? "한 명으로 끝내긴 아깝잖아요."
              : "아직 안 한 친구는 초대하고, 이미 한 친구는 코드로 바로 봐요."}
          </Typography>
        </div>

        {/* 케미가 준비된 카드에 이미 장난감 두 칸이 있으므로, 그 아래에서는 미리보기를 반복하지 않는다. */}
        {!hasFriend && (
          <div className="flex items-start justify-center gap-4 py-1">
            <div className="flex flex-col items-center gap-3">
              <div className={`${TOY_SLOT} bg-gray-01`}>
                <img src={imageUrl} alt="" className="size-14 object-contain" />
              </div>
              <Typography variant="sb4" className="text-gray-09">
                {ownerLabel}
              </Typography>
            </div>

            <div className="flex h-20 items-center">
              <Typography variant="me2" as="span" className="text-gray-04">
                ×
              </Typography>
            </div>

            <div className="flex flex-col items-center gap-3">
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
        )}

        {inviteButton}

        {/* 초대와 코드 입력은 상대가 테스트를 했는지로 갈린다. 경계를 문장으로 밝혀둔다. */}
        <div className="flex w-full items-center gap-3">
          <span className="bg-gray-02 h-px flex-1" />
          <Typography variant="me4" className="text-gray-05 shrink-0">
            이미 테스트한 친구라면
          </Typography>
          <span className="bg-gray-02 h-px flex-1" />
        </div>

        {friendCodeField}
      </div>

      {/* ------- 4. 케미 없이 결과만 보낼 때 ------ */}
      {/* 아이콘·글씨가 모두 회색이던 때는 눌리는 줄로 보이지 않았다. 알약으로 만들어 행동을
          드러내되, 버튼이 54px 최소 탭 영역을 갖도록 행 패딩을 줄여 높이는 그대로 뒀다. */}
      <div className="flex w-full items-center justify-between gap-3 rounded-[20px] bg-white px-5 py-3">
        <Typography variant="sb4" className="text-gray-09">
          결과지 링크 공유하기
        </Typography>
        <button
          type="button"
          onClick={handleCopyLink}
          className="bg-main flex shrink-0 items-center gap-1 rounded-full px-[14px] py-2 text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          <LinkIcon className="size-4" />
          <Typography variant="me3" as="span">
            복사
          </Typography>
        </button>
      </div>

      <button type="button" onClick={handleRetry}>
        <Typography variant="me2" className="text-gray-04">
          테스트 다시 하기
        </Typography>
      </button>
    </div>
  );
}
