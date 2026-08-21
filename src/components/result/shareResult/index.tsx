import type { RefObject } from "react";
import { useParams } from "react-router-dom";
import Typography from "@/components/shared/Typography";
import CopyIcon from "@/components/shared/icons/CopyIcon";
import LinkIcon from "@/components/shared/icons/LinkIcon";
import { useToast } from "@/hooks/useToast";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useTestStore } from "@/stores/testStore";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";

interface ShareResultProps {
  actionButtonMarkerRef?: RefObject<HTMLDivElement | null>;
  /** 이 결과지 주인의 닉네임. 코드·링크가 누구 것인지 밝히는 데 쓴다. */
  nickname: string;
  /** 이 결과지 주인의 장난감 이미지. 케미 미리보기 왼쪽 자리에 들어간다. */
  imageUrl: string;
  onSendChemiTest: () => void;
}

// ------- ShareResult UI ------
// 궁합(Compatible) 데이터와 무관하게 결과 코드(id)만으로 동작하는 공유 UI라 별도 섹션으로 분리했다.
// 빈 친구 자리와 가려진 케미 지수로 "친구가 있어야 채워지는 칸" 을 먼저 보여주고, 그 아래에
// 케미 초대 버튼을 둔다. 코드·링크는 케미 없이 결과만 보낼 때 쓰는 보조 수단이라 맨 아래로 내렸다.
export default function ShareResult({
  actionButtonMarkerRef,
  nickname,
  imageUrl,
  onSendChemiTest,
}: ShareResultProps) {
  const { id } = useParams<{ id: string }>();
  const inviteCode = id ?? "";
  const { open: openToast } = useToast();
  const navigate = useFriendNavigate();
  const resetTest = useTestStore((state) => state.reset);

  // 남의 결과지를 열었을 수도 있으므로 "내 것" 이라고 부르지 않는다. 주인 이름을 붙여 둔다.
  const ownerLabel = nickname ? `${nickname}님` : "나";

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
    <div ref={actionButtonMarkerRef} className="flex flex-col items-center gap-4 px-5 pt-6 pb-8">
      {/* ------- 섹션 안내 ------ */}
      <div className="flex flex-col items-center gap-2">
        <Typography variant="h2" className="text-gray-09">
          친구와 나의 케미는?
        </Typography>
        <Typography variant="me3" className="text-center text-gray-05 break-keep">
          친구도 장난감을 만들면
          <br />둘 사이 설명서가 나와요
        </Typography>
      </div>

      {/* ------- 케미 미리보기(친구 자리가 비어 있음) ------ */}
      <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white p-5">
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-20 items-center justify-center rounded-[20px] bg-gray-01">
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
            <div className="flex size-20 items-center justify-center rounded-[20px] border-2 border-dashed border-gray-03">
              <Typography variant="h1" as="span" className="text-gray-04">
                ?
              </Typography>
            </div>
            <Typography variant="sb4" className="text-gray-04">
              친구
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

      {/* ------- 케미 초대 ------ */}
      <button
        type="button"
        onClick={onSendChemiTest}
        className="bg-sub-4 flex h-[54px] w-full items-center justify-center rounded-[15px] text-white transition-opacity hover:opacity-90 active:opacity-80"
      >
        <Typography variant="h3" as="span">
          케미 테스트 보내기
        </Typography>
      </button>

      {/* ------- 케미 없이 결과만 보낼 때 쓰는 보조 수단 ------ */}
      <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white p-5">
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

        <hr className="border-t border-gray-02" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <Typography variant="sb4" className="text-gray-09">
              {ownerLabel} 설명서 링크
            </Typography>
            <Typography variant="me3" className="text-gray-05 break-keep">
              케미 없이 결과만 보여줄 때
            </Typography>
          </div>
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
