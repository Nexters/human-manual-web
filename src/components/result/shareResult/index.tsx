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
}

// ------- ShareResult UI ------
// 궁합(Compatible) 데이터와 무관하게 결과 코드(id)만으로 동작하는 공유 UI라 별도 섹션으로 분리했다.
export default function ShareResult({ actionButtonMarkerRef }: ShareResultProps) {
  const { id } = useParams<{ id: string }>();
  const inviteCode = id ?? "";
  const { open: openToast } = useToast();
  const navigate = useFriendNavigate();
  const resetTest = useTestStore((state) => state.reset);

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
    <div className="flex flex-col items-center gap-4 px-5 pt-2 pb-8">
      <div ref={actionButtonMarkerRef} />

      <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Typography variant="me3" className="text-gray-05">
              내 코드
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

        <hr className="border-t border-gray-02" />

        <div className="flex flex-col gap-1">
          <Typography variant="sb3" className="text-gray-09">
            친구에게 공유하고 케미확인하기
          </Typography>
          <Typography variant="me3" className="text-gray-05">
            링크를 보내면 친구가 바로 케미를 확인할 수 있어요.
          </Typography>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="bg-sub-4 flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          <Typography variant="h3" as="span">
            결과지 링크 복사하기
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
