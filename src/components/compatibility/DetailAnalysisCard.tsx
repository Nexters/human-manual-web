import Typography from "@/components/shared/Typography";

type DetailAnalysisCardProps = {
  index: number;
  title: string;
  description: string;
};

export default function DetailAnalysisCard({ index, title, description }: DetailAnalysisCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[10px] bg-white p-5">
      <div className="flex items-center gap-3">
        <span
          className="bg-sub-5 text-sub-4 flex size-7 shrink-0 items-center justify-center rounded-full text-[16px]"
          style={{ fontFamily: "'ThePosterFont', var(--font-sans)" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <Typography variant="h3" className="text-gray-09">
          {title}
        </Typography>
      </div>
      <Typography variant="me3" className="text-gray-07">
        {description}
      </Typography>
    </div>
  );
}
