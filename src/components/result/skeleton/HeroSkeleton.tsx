import SkeletonBox from "@/components/result/skeleton/SkeletonBox";

const TAG_POSITIONS = [
  "absolute top-[2%] right-[2%]",
  "absolute bottom-[15%] left-[-3%]",
  "absolute bottom-[-5%] right-[7%]",
] as const;

export default function HeroSkeleton() {
  return (
    <section className="relative w-full min-h-dvh overflow-hidden bg-gray-01">
      <div className="h-[60px]" />

      {/* ----- 상단 배지 & 타이틀 자리 ----- */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-5 pt-[100px]">
        <SkeletonBox className="h-[35px] w-[88px] rounded-full" />

        <div className="flex flex-col items-center gap-3">
          <SkeletonBox className="h-[24px] w-[220px]" />
          <SkeletonBox className="h-[40px] w-[160px]" />
        </div>
      </div>

      {/* ----- 중앙 캐릭터 & 태그 자리 ----- */}
      <div className="absolute left-1/2 top-[58%] z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2">
        <SkeletonBox className="h-full w-full rounded-full" />
        {TAG_POSITIONS.map((position) => (
          <SkeletonBox key={position} className={`${position} h-[38px] w-[110px] rounded-full`} />
        ))}
      </div>
    </section>
  );
}
