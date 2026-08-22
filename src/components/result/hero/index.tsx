import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import resultBg from "@/assets/img/backgrounds/room-bg.png";
import Typography from "@/components/shared/Typography";
import { useFriendNavigate } from "@/hooks/useFriendNavigate";
import { useInitialViewportHeight } from "@/hooks/useInitialViewportHeight";
import HeroTopBar from "./TopBar";
import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import HeroTag from "./Bubble";

interface HeroProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  tags?: string[];
  imageUrl?: string;
  isTopBarDark?: boolean;
}

// HeroTopBar 가 fixed h-[60px] 로 화면 위를 덮는다. 스크롤 목적지에서 그만큼 빼야
// 다음 섹션 제목이 상단바에 가리지 않는다.
const TOP_BAR_HEIGHT = 60;

const TAG_POSITIONS = [
  "absolute top-[2%] right-[2%]",
  "absolute bottom-[15%] left-[-3%]",
  "absolute bottom-[-5%] right-[7%]",
] as const;

export default function Hero({
  title = "팽이 지은",
  subtitle = "새벽 2시에도 카톡 폭격하는",
  badge = "상위 4%",
  tags = ["도파민 MAX", "장난꾸러기", "혼자서도 잘놀아요"],
  imageUrl,
  isTopBarDark = false,
}: HeroProps) {
  const navigate = useNavigate();
  const navigateWithFriend = useFriendNavigate();
  // 카카오톡 인앱 브라우저는 스크롤 중 상단바가 나타났다 사라지며 svh/lvh/dvh
  // 값이 실시간 재계산될 수 있어, 그 안의 배경/캐릭터(% 기준 배치)가 함께
  // 흔들린다. 마운트 시점의 높이를 한 번만 측정해 고정 px로 써서 이를 막는다.
  const viewportHeight = useInitialViewportHeight();
  const sectionRef = useRef<HTMLElement>(null);

  // 히어로가 화면을 꽉 채워서 아래에 뭐가 더 있는지 안 보인다. 화살표를 눌러 바로 다음
  // 섹션(핵심 특징)으로 내려보낸다.
  const handleScrollToContent = () => {
    const section = sectionRef.current;
    if (!section) return;

    const contentTop = window.scrollY + section.getBoundingClientRect().bottom - TOP_BAR_HEIGHT;
    window.scrollTo({ top: contentTop, behavior: "smooth" });
  };

  // 케미 페이지에서 "자세히 보기" 로 넘어온 경우처럼 앱 안에 히스토리가 쌓여 있으면
  // 온 곳으로 돌려보낸다. 링크로 바로 들어와 히스토리가 없을 때만 온보딩으로 보낸다
  // (그대로 뒤로 가면 앱 밖으로 나간다).
  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigateWithFriend("/");
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: viewportHeight }}
    >
      <img
        src={resultBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <HeroTopBar title="장난감 소개서" onBack={handleBack} isDark={isTopBarDark} />

      {/* ----- 상단 배지 & 타이틀 섹션 ----- */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-5 pt-[100px]">
        <div className="rounded-full bg-sub-3 px-4 py-2">
          <Typography variant="h3" className="text-gray-08">
            {badge}
          </Typography>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <Typography variant="sb2" className="text-white break-keep">
            {subtitle}
          </Typography>
          <p
            className="text-[40px] leading-[1] font-normal tracking-[-0.04em] text-white break-keep"
            style={{ fontFamily: "'Waguri', var(--font-sans)" }}
          >
            {title}
          </p>
        </div>
      </div>

      {/* ----- 중앙 팽이 & 태그 섹션 -----
          퍼센트 top으로 뷰포트 높이에 비례해 배치했더니, 화면이 짧은 기기(특히 안드로이드)에서
          위 타이틀 블록(고정 px 높이)과 겹치는 문제가 있었다. 타이틀 다음 flow에 자연스럽게
          이어지도록 relative로 바꾸고, 태그만 이 박스 기준으로 absolute 배치한다. */}
      <div className="relative z-10 mx-auto mt-20 h-[320px] w-[320px]">
        <img src={imageUrl} alt={title} className="h-full w-full object-contain" />
        {tags.map((tag, idx) => (
          <HeroTag key={idx} className={TAG_POSITIONS[idx]}>
            {tag}
          </HeroTag>
        ))}
      </div>

      {/* ----- 하단 CTA 섹션 ----- */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex h-[192px] flex-col items-center justify-end pb-8">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-gray-00"
          aria-hidden
        />
        <button
          type="button"
          onClick={handleScrollToContent}
          className="flex flex-col items-center gap-1"
        >
          <Typography variant="sb3" className="text-gray-08">
            내 장난감 설명서 보러가기
          </Typography>
          <span className="flex flex-col items-center gap-0 -space-y-1">
            <ChevronLeftIcon className="rotate-180 w-3 h-3 text-gray-08" />
            <ChevronLeftIcon className="rotate-180 w-3 h-3 text-gray-08" />
          </span>
        </button>
      </div>
    </section>
  );
}
