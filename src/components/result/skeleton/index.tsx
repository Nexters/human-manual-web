import HeroSkeleton from "@/components/result/skeleton/HeroSkeleton";
import SectionSkeleton from "@/components/result/skeleton/SectionSkeleton";

export default function ResultPageSkeleton() {
  return (
    <div className="bg-gray-00 pb-[92px]">
      <HeroSkeleton />
      <SectionSkeleton variant="sliders" />
      <SectionSkeleton variant="grid" />
      <SectionSkeleton variant="list" />
      <SectionSkeleton variant="list" />
      <SectionSkeleton variant="gauge" />
      <SectionSkeleton variant="cards" />
    </div>
  );
}
