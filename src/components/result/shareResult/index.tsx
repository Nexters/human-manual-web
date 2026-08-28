import { useParams } from "react-router-dom";
import Typography from "@/components/shared/Typography";
import Spinner from "@/components/shared/Spinner";
import { useToast } from "@/hooks/useToast";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useTestStore } from "@/stores/testStore";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";
import friendBear from "@/assets/img/result/share/bear.png";
import questionMark from "@/assets/img/result/share/question.png";

interface ShareResultProps {
  /** 이 결과지 주인의 닉네임. 프로필 대결 왼쪽 라벨에 쓴다. */
  nickname: string;
  /** 이 결과지 주인의 장난감 이미지. 프로필 대결 왼쪽 자리에 들어간다. */
  imageUrl: string;
  /**
   * 친구 링크(?friend=)로 이 결과지에 이어진 상대의 닉네임.
   * 있으면 첫 버튼이 "공유하기" 대신 "○○님과 테스트 바로 확인"으로 바뀐다.
   */
  friendNickname?: string;
  /** 케미 조회 중이면 첫 버튼을 스피너로 잠근다. */
  isCheckingChemi?: boolean;
  /** "친구에게 케미 테스트 공유하기" — 기존 공유 모달을 연다. */
  onSendChemiTest: () => void;
  /** friendNickname 이 있을 때, 케미 페이지로 바로 넘긴다. */
  onViewChemi?: () => void;
}

// 이 구간의 섹션 헤딩은 결과지의 다른 섹션 헤딩(SectionTitle, 24px)과 달리 Figma에서
// Pretendard Bold 20(=Typography h2)을 쓴다. 그래서 SectionTitle을 재사용하지 않는다.
function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <Typography variant="h2" className="text-gray-09 text-center break-keep">
        {title}
      </Typography>
      <Typography variant="sb3" className="text-gray-06 text-center break-keep">
        {subtitle}
      </Typography>
    </div>
  );
}

// ------- ShareResult UI ------
// 궁합(Compatible) 데이터와 무관하게 결과 코드(id)만으로 동작하는 공유 UI라 별도 섹션으로 분리했다.
//
// 결과지를 케미 허브로 쓴다. 친구를 부르는 길은 "친구에게 케미 테스트 공유하기"(공유 모달) 하나로
// 모았다. 모달이 보내는 링크(/?friend=<내코드>)로 친구가 들어와 테스트를 마치면 그 화면에서
// 케미가 열리므로, 이 화면에서 친구 코드를 직접 받거나 케미 결과를 미리 보여줄 필요가 없다.
export default function ShareResult({
  nickname,
  imageUrl,
  friendNickname,
  isCheckingChemi = false,
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
  // 친구 링크로 들어와 테스트를 마친 경우: 첫 버튼이 케미 페이지로 바로 넘기는 버튼이 된다.
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
    <div className="flex flex-col items-center px-5 pt-6 pb-8">
      {/* ------- 1. 케미 초대 ------ */}
      <SectionHeading
        title="친구와의 진짜 케미를 알아볼까요?"
        subtitle="친구를 초대해 둘의 케미를 확인해보세요."
      />

      {/* 프로필 대결 — 왼쪽은 이 결과지 주인, 오른쪽은 아직 모르는 친구 자리 */}
      <div className="mt-14 flex items-start justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-[93px] items-center justify-center rounded-full bg-white">
            <img src={imageUrl} alt="" className="size-[72px] object-contain" />
          </div>
          <Typography variant="sb4" className="text-gray-07">
            {ownerLabel}
          </Typography>
        </div>

        <div className="flex h-[93px] items-center">
          <Typography variant="me3" as="span" className="text-gray-04">
            ×
          </Typography>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-[93px] items-center justify-center rounded-full bg-white">
            <img src={friendBear} alt="" className="size-[78px] object-contain" />
            {/* 물음표 원본 비율(24x41)을 유지하도록 높이만 지정하고 너비는 auto */}
            <img src={questionMark} alt="" className="absolute h-[18px] w-auto" />
          </div>
          <Typography variant="sb4" className="text-gray-07">
            친구
          </Typography>
        </div>
      </div>

      {/* ------- 2. 행동 버튼 ------ */}
      <div className="mt-14 flex w-full flex-col gap-3">
        {/* 친구 링크로 들어와 테스트를 마친 경우(hasFriend)엔 첫 버튼이 케미 페이지로
            바로 넘기는 버튼이 된다. 나머지 레이아웃은 그대로다. */}
        {hasFriend ? (
          <button
            type="button"
            onClick={onViewChemi}
            disabled={isCheckingChemi}
            className="bg-main flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
          >
            {isCheckingChemi ? (
              <Spinner className="size-6" />
            ) : (
              <Typography variant="h2" as="span">
                {friendNickname}님과 케미 바로 확인
              </Typography>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSendChemiTest}
            className="bg-main flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
          >
            <Typography variant="h2" as="span">
              친구에게 케미 테스트 공유하기
            </Typography>
          </button>
        )}

        {/* Figma 폭 비율 129:210 ≈ 37:63 */}
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="border-gray-04 text-gray-06 flex h-[54px] flex-[37] items-center justify-center rounded-[10px] border-[1.5px] bg-white transition-opacity hover:opacity-90 active:opacity-80"
          >
            <Typography variant="h2" as="span">
              테스트 하기
            </Typography>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="border-main-light text-main flex h-[54px] flex-[63] items-center justify-center rounded-[10px] border-[1.5px] bg-white transition-opacity hover:opacity-90 active:opacity-80"
          >
            <Typography variant="h2" as="span">
              ↗ 내 결과지 공유
            </Typography>
          </button>
        </div>
      </div>

      {/* ------- 3. 코드 보관 ------ */}
      {/* 로그인이 없어 이 코드가 결과지·케미에 닿는 유일한 열쇠다. 옮겨 적어야 하는 값이라
          박스만 물들이고 카드로는 감싸지 않는다. */}
      <div className="mt-12 w-full">
        <SectionHeading
          title="내 코드를 저장해두세요"
          subtitle="코드로 내 결과와 친구 케미를 다시 볼 수 있어요."
        />

        {/* Figma 기준 "복사" 버튼은 세로 중앙이 아니라 "내 결과 코드" 라벨 줄에 맞춰 위쪽에 붙는다 */}
        <div className="bg-gray-01 mt-6 flex w-full items-start justify-between gap-3 rounded-[10px] px-5 py-5">
          <div className="flex flex-col gap-1">
            <Typography variant="sb3" className="text-gray-06">
              내 결과 코드
            </Typography>
            <Typography variant="h2" as="span" className="text-sub-4">
              {inviteCode}
            </Typography>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="text-gray-06 -mt-[2px] flex h-[30px] shrink-0 items-center rounded-[20px] bg-white px-4 transition-opacity hover:opacity-90 active:opacity-80"
          >
            <Typography variant="sb3" as="span">
              복사
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
}
