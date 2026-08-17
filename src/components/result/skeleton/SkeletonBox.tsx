import { cn } from "@/lib/cn";

type SkeletonBoxProps = {
  className?: string;
};

export default function SkeletonBox({ className }: SkeletonBoxProps) {
  return <div className={cn("animate-skeleton-pulse rounded-[10px] bg-gray-02", className)} />;
}
