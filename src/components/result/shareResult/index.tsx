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
// 빈 친구 자리와 가려진 케미 지수로 "친구가 있어야 채워지는 칸" 을 먼저 보여주고, 그 아래에서
// 초대를 받는다. 친구가 이미 정해져 있으면 그 자리를 채우고 CTA 를 케미 보기로 바꾼다.
// 코드·링크는 케미 없이 결과만 보낼 때 쓰는 보조 수단이라 맨 아래로 내렸다.
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
      {/* ------- 섹션 안내 ------ */}
      <div className="flex flex-col items-center gap-2">
        <Typography variant="h2" className="text-gray-09">
          친구와 나의 케미는?
        </Typography>
        <Typography variant="me3" className="text-center text-gray-05 break-keep">
          {hasFriend ? (
            "둘 사이 설명서가 준비됐어요"
          ) : (
            <>
              친구도 장난감을 만들면
              <br />둘 사이 설명서가 나와요
            </>
          )}
        </Typography>
      </div>

      {/* ------- 케미 미리보기 ------ */}
      <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white p-5">
        <div className="flex items-center justify-center gap-4">
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

        <hr className="border-t border-gray-02" />

        <div className="flex flex-col items-center gap-1">
          <Typography variant="me3" className="text-gray-05">
            둘의 케미 지수
          </Typography>
          <span className="text-[36px] leading-none font-bold text-gray-03">??%</span>
        </div>
      </div>

      {/* ------- 케미로 넘어가는 유일한 입구 ------ */}
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
            {hasFriend ? `${friendNickname}님과의 케미 보러가기` : "친구에게 테스트 링크 공유하기"}
          </Typography>
        )}
      </button>

      {/* ------- 케미 없이 결과만 보낼 때 쓰는 보조 수단 ------ */}
      <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white p-5">
        {/* 로그인이 없어 이 코드가 결과지에 닿는 유일한 열쇠다. 잃으면 되찾을 방법이 없다. */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Typography variant="me3" className="text-gray-05">
                {ownerLabel} 코드
              </Typography>
              <Typography variant="sb3" className="text-gray-09">
                {inviteCode}
              </Typography>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex shrink-0 items-center gap-1"
            >
              <CopyIcon className="size-4 text-gray-05" />
              <Typography variant="me3" className="text-gray-05">
                복사
              </Typography>
            </button>
          </div>
          <Typography variant="me4" className="text-gray-04 break-keep">
            복사해두면 나중에 이 결과를 다시 볼 수 있어요
          </Typography>
        </div>

        <hr className="border-t border-gray-02" />

        <div className="flex items-center justify-between gap-3">
          <Typography variant="sb4" className="text-gray-09">
            결과지 링크 공유하기
          </Typography>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex shrink-0 items-center gap-1"
          >
            <LinkIcon className="size-4 text-gray-05" />
            <Typography variant="me3" className="text-gray-05">
              복사
            </Typography>
          </button>
        </div>
      </div>

      <button type="button" onClick={handleRetry}>
        <Typography variant="me2" className="text-gray-04">
          테스트 다시 하기
        </Typography>
      </button>
    </div>
  );
}
