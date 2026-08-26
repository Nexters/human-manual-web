import SkeletonBox from "@/components/result/skeleton/SkeletonBox";

// ------- 케미 페이지 스켈레톤 ------
// 두 곳에서 쓴다. 케미 조회가 끝나기 전의 이 페이지, 그리고 친구 링크로 들어온 사람을
// 케미로 자동 전환하는 동안의 온보딩. 둘 다 전에는 흰 화면이었다.
export default function CompatibilityPageSkeleton() {
  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col">
      {/* 상단바 자리 */}
      <div className="flex h-[60px] items-center px-5">
        <SkeletonBox className="h-6 w-24" />
      </div>

      <div className="flex flex-col gap-8 px-5 pt-[54px] pb-8">
        {/* 매치업 — 장난감 두 칸과 × */}
        <div className="flex items-start justify-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <SkeletonBox className="size-[134px] rounded-[20px]" />
            <SkeletonBox className="h-5 w-16" />
          </div>
          <div className="flex h-[134px] items-center">
            <SkeletonBox className="size-5 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <SkeletonBox className="size-[134px] rounded-[20px]" />
            <SkeletonBox className="h-5 w-16" />
          </div>
        </div>

        {/* 헤드라인과 설명 */}
        <div className="flex flex-col items-center gap-3">
          <SkeletonBox className="h-7 w-56" />
          <SkeletonBox className="h-5 w-full" />
          <SkeletonBox className="h-5 w-4/5" />
        </div>

        {/* 케미 게이지 */}
        <div className="flex flex-col gap-4 rounded-[20px] bg-white p-5">
          <SkeletonBox className="h-6 w-28" />
          <SkeletonBox className="h-2 w-full rounded-full" />
          <SkeletonBox className="h-5 w-3/4" />
        </div>

        {/* 상세 분석 2×2 */}
        <div className="grid grid-cols-2 gap-[10px]">
          <SkeletonBox className="h-[132px] rounded-[20px]" />
          <SkeletonBox className="h-[132px] rounded-[20px]" />
          <SkeletonBox className="h-[132px] rounded-[20px]" />
          <SkeletonBox className="h-[132px] rounded-[20px]" />
        </div>

        {/* 팁 카드 */}
        <div className="flex flex-col gap-4">
          <SkeletonBox className="h-6 w-40 self-center" />
          <SkeletonBox className="h-[108px] rounded-[20px]" />
          <SkeletonBox className="h-[108px] rounded-[20px]" />
        </div>
      </div>
    </div>
  );
}
