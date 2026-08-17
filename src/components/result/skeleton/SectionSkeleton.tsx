import type { ReactElement } from "react";
import SkeletonBox from "@/components/result/skeleton/SkeletonBox";

type SectionSkeletonVariant = "sliders" | "grid" | "list" | "gauge" | "cards";

type SectionSkeletonProps = {
  variant: SectionSkeletonVariant;
};

function SectionTitleSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <SkeletonBox className="h-[26px] w-[160px]" />
      <SkeletonBox className="h-[18px] w-[120px]" />
    </div>
  );
}

function SlidersContent() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <SkeletonBox key={idx} className="h-[37px] w-full" />
      ))}
      <div className="flex flex-col gap-4">
        <SkeletonBox className="h-[152px] w-full" />
        <SkeletonBox className="h-[152px] w-full" />
      </div>
    </div>
  );
}

function GridContent() {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonBox className="mx-auto h-[160px] w-[200px]" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonBox key={idx} className="h-[92px] w-full" />
        ))}
      </div>
      <SkeletonBox className="h-[80px] w-full" />
    </div>
  );
}

function ListContent() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <SkeletonBox key={idx} className="h-[46px] w-full" />
      ))}
    </div>
  );
}

function GaugeContent() {
  return (
    <div className="flex flex-col items-center gap-6">
      <SkeletonBox className="h-[110px] w-[220px] rounded-t-full" />
      <div className="grid w-full grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonBox key={idx} className="h-[110px] w-full" />
        ))}
      </div>
    </div>
  );
}

function CardsContent() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBox className="h-[220px] w-full" />
        <SkeletonBox className="h-[220px] w-full" />
      </div>
      <SkeletonBox className="mx-auto h-[54px] w-full" />
    </div>
  );
}

const CONTENT_BY_VARIANT: Record<SectionSkeletonVariant, () => ReactElement> = {
  sliders: SlidersContent,
  grid: GridContent,
  list: ListContent,
  gauge: GaugeContent,
  cards: CardsContent,
};

export default function SectionSkeleton({ variant }: SectionSkeletonProps) {
  const Content = CONTENT_BY_VARIANT[variant];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      <SectionTitleSkeleton />
      <Content />
    </div>
  );
}
