import { useNavigate } from "react-router-dom";
import resultBg from "@/assets/img/backgrounds/room-bg.png";
import Typography from "@/components/shared/Typography";
import HeroTopBar from "./TopBar";
import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import HeroTag from "./Bubble";
import { getCharacterImage } from "@/constants/characterImages";

interface HeroProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  tags?: string[];
  characterId?: string;
  isTopBarDark?: boolean;
}

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
  characterId,
  isTopBarDark = false,
}: HeroProps) {
  const navigate = useNavigate();
  const characterImage = getCharacterImage(characterId ?? "");

  const handleBack = () => {
    navigate("/");
  };

  return (
    <section className="relative w-full min-h-dvh overflow-hidden">
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

      {/* ----- 중앙 팽이 & 태그 섹션 ----- */}
      <div className="absolute left-1/2 top-[58%] z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2">
        <img src={characterImage} alt={title} className="h-full w-full object-contain" />
        {tags.map((tag, idx) => (
          <HeroTag key={idx} className={TAG_POSITIONS[idx]}>
            {tag}
          </HeroTag>
        ))}
      </div>

      {/* ----- 하단 CTA 섹션 ----- */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex h-[192px] flex-col items-center justify-end gap-1 pb-8">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-gray-00"
          aria-hidden
        />
        <Typography variant="sb4" className="text-gray-08">
          내 장난감 설명서 보러가기
        </Typography>
        <div className="flex flex-col items-center gap-0 -space-y-1">
          <ChevronLeftIcon className="rotate-180 w-3 h-3 text-gray-08" />
          <ChevronLeftIcon className="rotate-180 w-3 h-3 text-gray-08" />
        </div>
      </div>
    </section>
  );
}
