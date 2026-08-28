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
        {/* 헤드라인과 설명 (프로필 위) */}
        <div className="flex flex-col items-center gap-3">
          <SkeletonBox className="h-7 w-56" />
          <SkeletonBox className="h-5 w-4/5" />
        </div>

        {/* 매치업 — 장난감 두 칸과 × */}
        <div className="flex items-start justify-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <SkeletonBox className="size-[134px] rounded-full" />
            <SkeletonBox className="h-5 w-16" />
            <SkeletonBox className="h-8 w-24 rounded-full" />
          </div>
          <div className="flex h-[134px] items-center">
            <SkeletonBox className="size-5 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <SkeletonBox className="size-[134px] rounded-full" />
            <SkeletonBox className="h-5 w-16" />
            <SkeletonBox className="h-8 w-24 rounded-full" />
          </div>
        </div>

        {/* 케미 게이지 */}
        <div className="flex flex-col gap-4 rounded-[10px] bg-white p-4">
          <SkeletonBox className="h-6 w-28" />
          <SkeletonBox className="h-2 w-full rounded-full" />
          <SkeletonBox className="h-5 w-3/4" />
        </div>

        {/* 상세 분석 아코디언 4칸 */}
        <div className="flex flex-col gap-[10px]">
          <SkeletonBox className="h-[52px] rounded-[10px]" />
          <SkeletonBox className="h-[52px] rounded-[10px]" />
          <SkeletonBox className="h-[52px] rounded-[10px]" />
          <SkeletonBox className="h-[52px] rounded-[10px]" />
        </div>

        {/* 팁 카드 */}
        <div className="flex flex-col gap-4">
          <SkeletonBox className="h-6 w-40 self-center" />
          <SkeletonBox className="h-[108px] rounded-[10px]" />
          <SkeletonBox className="h-[108px] rounded-[10px]" />
        </div>
      </div>

      {/* 다른 친구랑 케미 보기 — 버튼 두 개 */}
      <div className="flex flex-col gap-3 px-5 pb-8">
        <SkeletonBox className="h-[54px] rounded-[10px]" />
        <SkeletonBox className="h-[54px] rounded-[10px]" />
      </div>
    </div>
  );
}
