import { useParams } from "react-router-dom";
import Typography from "@/components/shared/Typography";
import Spinner from "@/components/shared/Spinner";
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
  /** 친구 링크로 이어진 상대. 있으면 오른쪽 자리가 채워지고 CTA 가 케미 보기로 바뀐다. */
  friendNickname?: string;
  friendImageUrl?: string;
  isCheckingChemi: boolean;
  onSendChemiTest: () => void;
  onViewChemi: () => void;
}

const TOY_SLOT = "flex size-20 items-center justify-center rounded-[20px]";

// ------- ShareResult UI ------
// 궁합(Compatible) 데이터와 무관하게 결과 코드(id)만으로 동작하는 공유 UI라 별도 섹션으로 분리했다.
//
// "코드를 복사해둬야 한다" 와 "케미는 친구가 테스트해야 나온다" 를 둘 다 놓친다는 피드백이 있어,
// 목적이 다른 둘을 각각 제목·이유·행동을 갖춘 카드로 갈랐다. 코드가 먼저 오는 건 그게 없으면
// 결과지로 돌아올 방법이 아예 없기 때문이다.
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
}: ShareResultProps) {
  const { id } = useParams<{ id: string }>();
  const inviteCode = id ?? "";
  const { open: openToast } = useToast();
  const navigate = useFriendNavigate();
  const resetTest = useTestStore((state) => state.reset);

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

  const handleRetry = () => {
    trackEvent(GA_EVENTS.RESULT.RETRY);
    resetTest();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center gap-4 px-5 pt-6 pb-8">
      {/* ------- 1. 내 코드 보관 ------ */}
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

        <div className="bg-gray-01 flex flex-col gap-1 rounded-[12px] px-4 py-3">
          <Typography variant="me4" className="text-gray-05">
            {ownerLabel} 코드
          </Typography>
          <div className="flex items-center justify-between gap-3">
            <Typography variant="h3" className="text-gray-09">
              {inviteCode}
            </Typography>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-main flex shrink-0 items-center gap-1"
            >
              <CopyIcon className="size-4" />
              <Typography variant="sb4" as="span">
                복사
              </Typography>
            </button>
          </div>
        </div>
      </div>

      {/* ------- 2. 케미 ------ */}
      <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white p-5">
        <div className="flex flex-col gap-1">
          <Typography variant="sb3" className="text-gray-09">
            {hasFriend ? "친구와의 케미가 준비됐어요" : "친구와의 케미도 볼 수 있어요"}
          </Typography>
          <Typography variant="me3" className="text-gray-06 break-keep">
            {hasFriend
              ? "둘 사이 설명서가 만들어졌어요."
              : "친구가 링크로 테스트를 마치면 친구 화면에 둘 사이 설명서가 떠요."}
          </Typography>
        </div>

        <div className="flex items-center justify-center gap-4 py-1">
          <div className="flex flex-col items-center gap-3">
            <div className={`${TOY_SLOT} bg-gray-01`}>
              <img src={imageUrl} alt="" className="size-14 object-contain" />
            </div>
            <Typography variant="sb4" className="text-gray-09">
              {ownerLabel}
            </Typography>
          </div>

          <Typography variant="me2" as="span" className="text-gray-04">
            ×
          </Typography>

          <div className="flex flex-col items-center gap-3">
            {hasFriend && friendImageUrl ? (
              <div className={`${TOY_SLOT} bg-gray-01`}>
                <img src={friendImageUrl} alt="" className="size-14 object-contain" />
              </div>
            ) : (
              <div className={`${TOY_SLOT} border-2 border-dashed border-gray-03`}>
                <Typography variant="h1" as="span" className="text-gray-04">
                  ?
                </Typography>
              </div>
            )}
            <Typography variant="sb4" className={hasFriend ? "text-gray-09" : "text-gray-04"}>
              {hasFriend ? `${friendNickname}님` : "친구"}
            </Typography>
          </div>
        </div>

        <button
          type="button"
          onClick={hasFriend ? onViewChemi : onSendChemiTest}
          disabled={isCheckingChemi}
          className="bg-sub-4 flex h-[54px] w-full items-center justify-center rounded-[15px] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
        >
          {isCheckingChemi ? (
            <Spinner className="size-6" />
          ) : (
            <Typography variant="h3" as="span">
              {hasFriend
                ? `${friendNickname}님과의 케미 보러가기`
                : "친구에게 테스트 링크 공유하기"}
            </Typography>
          )}
        </button>
      </div>

      {/* ------- 3. 케미 없이 결과만 보낼 때 ------ */}
      <div className="flex w-full items-center justify-between gap-3 rounded-[20px] bg-white px-5 py-4">
        <Typography variant="sb4" className="text-gray-09">
          결과지 링크 공유하기
        </Typography>
        <button type="button" onClick={handleCopyLink} className="flex shrink-0 items-center gap-1">
          <LinkIcon className="size-4 text-gray-05" />
          <Typography variant="me3" className="text-gray-05">
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
