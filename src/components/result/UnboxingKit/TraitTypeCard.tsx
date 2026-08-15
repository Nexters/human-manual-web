import Typography from "@/components/shared/Typography";
import Chip from "@/components/shared/Chip";
import { cn } from "@/lib/cn";

type TraitTypeCardProps = {
  title: string;
  chip1: string;
  chip2: string;
  description: string;
  image: string;
};

const chipBgMap: Record<string, string> = {
  point: "bg-point/10 text-point",
  "sub-1": "bg-sub-1/10 text-sub-1",
  "sub-2": "bg-sub-2/10 text-sub-2",
  "sub-3": "bg-sub-3/10 text-sub-3",
  "sub-4": "bg-sub-4/10 text-sub-4",
  "sub-5": "bg-sub-5/10 text-sub-5",
};

export default function TraitTypeCard({
  title,
  chip1,
  chip2,
  description,
  image,
}: TraitTypeCardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Image + Title + Chips */}
      <div className="flex flex-col items-center gap-3">
        <img src={image} alt={title} className="w-24 h-24 object-contain" />
        <Typography variant="sb3" className="text-gray-09">
          {title}
        </Typography>
        <div className="flex gap-2">
          <Chip className={cn("text-xs", chipBgMap["sub-5"])}>{chip1}</Chip>
          <Chip className={cn("text-xs", chipBgMap["sub-5"])}>{chip2}</Chip>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 rounded-[12px] bg-white p-4">
        <Typography variant="me3" className="font-semibold text-gray-09">
          왜 {title}인가요?
        </Typography>
        <Typography variant="me3" className="text-gray-07 leading-relaxed">
          {description}
        </Typography>
      </div>
    </div>
  );
}
