import type { RefObject } from "react";
import { useParams } from "react-router-dom";
import Typography from "@/components/shared/Typography";
import CopyIcon from "@/components/shared/icons/CopyIcon";
import { useToast } from "@/hooks/useToast";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useTestStore } from "@/stores/testStore";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";

interface ShareResultProps {
  actionButtonMarkerRef?: RefObject<HTMLDivElement | null>;
  /** 이 결과지 주인의 닉네임. 코드가 누구 것인지 밝히는 데 쓴다. */
  nickname: string;
  onSendChemiTest: () => void;
}

// ------- ShareResult UI ------
// 궁합(Compatible) 데이터와 무관하게 결과 코드(id)만으로 동작하는 공유 UI라 별도 섹션으로 분리했다.
// 케미 초대와 결과지 자랑은 목적이 다르므로 한 카드 안에서 나눠 두고, 코드는 링크가 막힌 곳에서
// 쓰는 폴백으로 맨 아래에 둔다.
export default function ShareResult({
  actionButtonMarkerRef,
  nickname,
  onSendChemiTest,
}: ShareResultProps) {
  const { id } = useParams<{ id: string }>();
  const inviteCode = id ?? "";
  const { open: openToast } = useToast();
  const navigate = useFriendNavigate();
  const resetTest = useTestStore((state) => state.reset);

  // 남의 결과지를 열었을 수도 있으므로 "내 코드" 라고 부르지 않는다. 주인 이름을 붙여 둔다.
  const codeCopyLabel = nickname ? `${nickname}님 결과 코드 복사` : "결과 코드 복사";

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
    <div ref={actionButtonMarkerRef} className="flex flex-col items-center gap-4 px-5 pt-2 pb-8">
      <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white p-5">
        <Typography variant="sb3" className="text-gray-09">
          친구에게 보내기
        </Typography>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onSendChemiTest}
            className="bg-sub-4 flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
          >
            <Typography variant="h3" as="span">
              케미 테스트 보내기
            </Typography>
          </button>
          <Typography variant="me3" className="text-gray-05 break-keep">
            링크를 공유 받은 친구는 코드를 입력하지 않고 우리 케미를 봐요
          </Typography>
        </div>

        <hr className="border-t border-gray-02" />

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="bg-main flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
          >
            <Typography variant="h3" as="span">
              결과지 링크 복사하기
            </Typography>
          </button>
          <Typography variant="me3" className="text-gray-05 break-keep">
            지금 보이는 장난감 설명서를 그대로 공유해요
          </Typography>
        </div>

        <hr className="border-t border-gray-02" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-[3px]">
            <Typography variant="me4" className="text-gray-05">
              {codeCopyLabel}
            </Typography>
            <Typography variant="sb4" className="text-gray-07">
              {inviteCode}
            </Typography>
          </div>
          <button type="button" onClick={handleCopyCode} className="flex items-center gap-1">
            <CopyIcon className="size-4 text-gray-05" />
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
