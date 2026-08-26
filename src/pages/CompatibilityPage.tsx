import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import InfoCard from "@/components/shared/InfoCard";
import Typography from "@/components/shared/Typography";
import MatchupProfileCard from "@/components/compatibility/MatchupProfileCard";
import SynergyScoreCard from "@/components/compatibility/SynergyScoreCard";
import DetailAnalysisCard from "@/components/compatibility/DetailAnalysisCard";
import DetailAnalysisModal from "@/components/compatibility/DetailAnalysisModal";
import { DETAIL_CONTENT, DETAIL_ORDER } from "@/components/compatibility/detailAnalysisContent";
import LongTermTipCard from "@/components/compatibility/LongTermTipCard";
import NextChemiCard from "@/components/compatibility/NextChemiCard";
import MyResultModal from "@/components/onboarding/MyResultModal";
import CompatibilityPageSkeleton from "@/components/compatibility/skeleton";
import CoupangPartnersAd from "@/components/shared/CoupangPartnersAd";
import { useCompatibility, compatibilityQueryKey } from "@/hooks/useCompatibility";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { verifyResultCode } from "@/api/assessment";
import { getCompatibility } from "@/api/compatibility";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { useFontsReady } from "@/hooks/useFontsReady";
import { share } from "@/utils/share";
import { isResultCode, takeResultCode } from "@/lib/resultCode";
import { useMyResultStore } from "@/stores/myResultStore";
import { appendFriendParam } from "@/lib/friendParam";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";
import { PRETENDARD_FONT_SPEC } from "@/constants/fonts";

// 매치업 프로필 카드와 상세 분석 카드가 더 이상 커스텀 폰트를 쓰지 않아,
// 이 페이지는 기본 프리텐다드 프리로드만 필요하다.
const COMPATIBILITY_PAGE_FONT_SPECS = [PRETENDARD_FONT_SPEC];

export default function CompatibilityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 공유 시트에서 복사한 값은 링크 뒤에 설명 문구가 눌러붙어 오므로, 코드만 떼어내 쓴다.
  const mine = takeResultCode(searchParams.get("mine")) ?? "";
  const friend = takeResultCode(searchParams.get("friend")) ?? "";

  const { data, isLoading, isError } = useCompatibility(mine, friend);
  const { open: openToast } = useToast();
  // 열람자가 누구인지는 URL 로 알 수 없다. 이 브라우저에 저장된 코드 하나로만 판단한다.
  const savedResultCode = useMyResultStore((state) => state.resultCode);
  const rememberResultCode = useMyResultStore((state) => state.setResultCode);
  const { open: openModal, close: closeModal } = useModal();
  const queryClient = useQueryClient();
  // 저장된 코드가 삭제·만료됐으면 조회가 실패한다. 그때만 코드 없음으로 되돌린다 —
  // 아직 안 온 것과 없는 것을 구분하지 않으면 죽은 코드로 링크를 만들어 준다.
  const { data: myResult, isError: myResultError } = useAssessmentResult(savedResultCode ?? "");
  const hasMyCode = Boolean(savedResultCode) && !myResultError;
  const fontsReady = useFontsReady(COMPATIBILITY_PAGE_FONT_SPECS);

  // 친구 초대 링크로 바로 들어온 경우 앱 안에 쌓인 히스토리가 없어, 뒤로가기가
  // 앱 밖(원래 있던 카톡 등)으로 나가버린다. 그럴 땐 온보딩으로 보낸다.
  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const topBar = <TopBar title="친구와의 케미" onBack={handleBack} className="bg-gray-00" />;

  if (!mine || !friend) {
    return (
      <div className="bg-gray-00 flex min-h-dvh flex-col">
        {topBar}
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <Typography variant="me2" className="text-gray-07">
            잘못된 접근이에요. 친구 초대 링크로 다시 시도해주세요.
          </Typography>
        </div>
      </div>
    );
  }

  if (isLoading || !fontsReady) {
    return <CompatibilityPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="bg-gray-00 flex min-h-dvh flex-col">
        {topBar}
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <Typography variant="me2" className="text-gray-07">
            케미 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </Typography>
        </div>
      </div>
    );
  }

  // headline 은 "찰떡궁합 환상의 장난감" 처럼 항상 "~~ 장난감" 꼴로 온다.
  // 마지막 낱말만 남기고 앞부분을 포인트 컬러로 가른다.
  const headlineWords = data.headline.trim().split(/\s+/);
  const headlineNoun = headlineWords.at(-1) ?? "";
  const headlineModifier = headlineWords.slice(0, -1).join(" ");

  // 케미 URL 에 두 사람 코드가 다 실려 있다. 조회 없이 그대로 복사해줄 수 있다.
  // 매치업 카드가 코드를 화면에 내걸지 않으므로, 누구 코드가 복사됐는지는 이 토스트가
  // 유일한 확인 수단이다. 두 카드가 나란히 있어 잘못 누를 수 있으니 닉네임을 밝힌다.
  const handleCopyResultCode = async (resultCode: string, nickname: string) => {
    try {
      await navigator.clipboard.writeText(resultCode);
    } catch {
      // 클립보드 권한이 없는 환경에서도 안내는 그대로 노출한다
    }
    trackEvent({
      ...GA_EVENTS.RESULT.INVITE_CODE_COPY,
      label: "케미페이지_매치업_코드복사",
    });
    openToast(`${nickname}님 코드가 복사되었습니다`);
  };

  // 저장된 내 코드로 초대 링크를 만든다. 아직 테스트 안 한 친구를 부르는 용도다.
  const handleCopyMyChemiLink = async (resultCode: string) => {
    if (!resultCode) return;
    const url = new URL("/", window.location.origin);
    url.searchParams.set("friend", resultCode);

    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {
      // 클립보드 권한이 없는 환경에서도 안내는 그대로 노출한다
    }
    trackEvent({
      ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
      label: "케미페이지_내케미링크복사",
    });
    openToast("내 케미 링크를 복사했어요");
  };

  // 코드가 이 브라우저에 없지만 다른 기기에서 이미 테스트를 마친 사람용.
  // 코드를 받아 저장한 뒤 곧바로 링크까지 복사해준다 — 홈으로 튕겨 보내면 흐름이 끊긴다.
  const openMyCodeModal = () => {
    openModal({
      title: "내 코드 입력하기",
      contents: (
        <MyResultModal
          description={
            <>
              코드를 입력하면 친구에게 보낼
              <br />내 케미 테스트 링크를 만들 수 있어요
            </>
          }
          submitLabel="링크 복사하기"
          onSubmit={(resultCode) => {
            closeModal();
            rememberResultCode(resultCode);
            void handleCopyMyChemiLink(resultCode);
          }}
        />
      ),
    });
  };

  // 이 페이지의 두 사람이 아닌 다른 친구와의 케미로 넘어간다. 내 코드는 저장된 값을 쓰고
  // 상대 코드만 받는다. 궁합 API 는 어느 코드가 없는지 알려주지 않아 실패 뒤에 따로 확인한다.
  const handleCheckFriendChemi = async (inputCode: string): Promise<string | null> => {
    if (!savedResultCode) return "잠시 후 다시 시도해주세요";

    const nextFriend = inputCode.trim();
    if (!isResultCode(nextFriend)) return "코드를 다시 입력해주세요";
    // 서버는 두 코드가 같아도 200 으로 자기 자신과의 궁합을 돌려주므로 여기서 막는다.
    if (nextFriend === savedResultCode) return "친구 코드를 입력해주세요";

    try {
      // 조회가 성공한 뒤에만 이동한다. 캐시에 담아두면 이동 직후 바로 렌더된다.
      await queryClient.fetchQuery({
        queryKey: compatibilityQueryKey(savedResultCode, nextFriend),
        queryFn: () => getCompatibility(savedResultCode, nextFriend),
      });
    } catch {
      const exists = await verifyResultCode(nextFriend);
      return exists
        ? "케미 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요"
        : "코드를 다시 입력해주세요";
    }

    trackEvent({
      ...GA_EVENTS.ONBOARDING.COMPATIBILITY_START,
      label: "케미페이지_친구코드입력",
    });
    navigate(
      `/compatibility?mine=${encodeURIComponent(savedResultCode)}&friend=${encodeURIComponent(nextFriend)}`,
    );
    return null;
  };

  // 그리드 칸에서 잘린 설명을 자르지 않고 크게 보여준다. 제목은 모달 헤더가 아니라
  // 본문 안에 두어 아이콘 아래로 오게 한다 — 헤더에 넣으면 아이콘보다 위로 올라간다.
  const openDetailModal = (
    content: (typeof DETAIL_CONTENT)[keyof typeof DETAIL_CONTENT],
    description: string,
  ) => {
    openModal({
      contents: (
        <DetailAnalysisModal
          icon={content.icon}
          titleBefore={content.titleBefore}
          titleHighlight={content.titleHighlight}
          titleAfter={content.titleAfter}
          description={description}
        />
      ),
    });
  };

  const handleShare = () => {
    trackEvent(GA_EVENTS.COMPATIBILITY.RESULT_SHARE);
    return share({
      title: data.headline,
      text: data.description,
      url: window.location.href,
    });
  };

  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col">
      {topBar}

      <div className="flex flex-1 flex-col gap-8 bg-gray-00 px-5 pt-[54px] pb-8">
        <div className="flex items-start justify-center gap-4">
          <MatchupProfileCard
            nickname={data.mine.nickname}
            image={data.mine.image_url}
            imageAlt={`${data.mine.noun} 캐릭터`}
            resultCode={mine}
            onViewResult={() => navigate(appendFriendParam(`/result/${mine}`, friend))}
            onCopyCode={() => void handleCopyResultCode(mine, data.mine.nickname)}
          />
          <div className="flex h-[134px] items-center justify-center">
            <Typography variant="h2" className="text-gray-03">
              ×
            </Typography>
          </div>
          <MatchupProfileCard
            nickname={data.friend.nickname}
            image={data.friend.image_url}
            imageAlt={`${data.friend.noun} 캐릭터`}
            resultCode={friend}
            onViewResult={() => navigate(appendFriendParam(`/result/${friend}`, mine))}
            onCopyCode={() => void handleCopyResultCode(friend, data.friend.nickname)}
          />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <Typography variant="h2" className="text-gray-08">
            <span className="text-sub-4">{headlineModifier}</span>
            {headlineModifier && " "}
            {headlineNoun}
          </Typography>
          <Typography variant="me2" className="text-gray-07">
            {data.description}
          </Typography>
        </div>

        <SynergyScoreCard
          score={data.synergy.score}
          label={data.synergy.title}
          description={data.synergy.description}
          tags={data.synergy.tags}
        />

        <div className="flex flex-col gap-4">
          <Typography variant="h2" className="text-gray-08 text-center">
            우리 사이 더 자세히 보기
          </Typography>

          <div className="grid grid-cols-2 gap-[10px]">
            {DETAIL_ORDER.map((key) => {
              const detail = data.details.find((item) => item.key === key);
              if (!detail) return null;
              const content = DETAIL_CONTENT[key];
              return (
                <DetailAnalysisCard
                  key={key}
                  icon={content.icon}
                  titleBefore={content.titleBefore}
                  titleHighlight={content.titleHighlight}
                  titleAfter={content.titleAfter}
                  description={detail.description}
                  onClick={() => openDetailModal(content, detail.description)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Typography variant="h2" className="text-gray-08 text-center">
            함께 있을 때 기억해주세요
          </Typography>

          {data.tips.map((tip) => (
            <InfoCard
              key={tip.target}
              icon={
                <img
                  src={tip.image_url}
                  alt={`${tip.title} 캐릭터`}
                  className="size-14 object-contain"
                />
              }
              title={tip.title}
              description={tip.description}
            />
          ))}
        </div>

        <LongTermTipCard
          title={data.relationship_tip.title}
          description={data.relationship_tip.description}
        />
      </div>

      {/* ------- 다음 케미로 가는 카드 ------ */}
      {/* sticky 플로팅 바를 없애고, 흐름의 끝에 다음 행동을 놓는다. 플로팅은 본문 마지막
          카드를 계속 가려서 다 읽었는지 알 수 없었다. */}
      <div className="flex flex-col items-center gap-4 px-5 pb-8">
        <NextChemiCard
          hasMyCode={hasMyCode}
          myImageUrl={myResult?.overview.image_url}
          onCopyMyChemiLink={() => void handleCopyMyChemiLink(savedResultCode ?? "")}
          onStartTest={() => navigate("/", { state: { startTest: true } })}
          onEnterCode={openMyCodeModal}
          onCheckFriendChemi={handleCheckFriendChemi}
        />

        <button type="button" onClick={handleShare} className="flex justify-center">
          <Typography variant="me3" as="span" className="text-gray-05">
            케미 결과지 링크 공유하기
          </Typography>
        </button>
      </div>

      {/* ------- 쿠팡 파트너스 광고 ------ */}
      <CoupangPartnersAd />
    </div>
  );
}
