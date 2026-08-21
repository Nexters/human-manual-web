import Typography from "@/components/shared/Typography";

type DetailAnalysisCardProps = {
  icon: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  description: string;
};

export default function DetailAnalysisCard({
  icon,
  titleBefore,
  titleHighlight,
  titleAfter,
  description,
}: DetailAnalysisCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-[10px] bg-white p-5">
      <img src={icon} alt="" className="size-[60px] object-contain" />
      <Typography variant="sb4" className="text-gray-09 font-bold break-keep">
        {titleBefore}
        <span className="text-main">{titleHighlight}</span>
        {titleAfter}
      </Typography>
      <Typography variant="me3" className="text-gray-07 break-keep">
        {description}
      </Typography>
    </div>
  );
}
