import Typography from "@/components/shared/Typography";
import Chip from "@/components/shared/Chip";
import { cn } from "@/lib/cn";

type TraitTypeCardProps = {
  title: string;
  chip1: string;
  chip1Color: "point" | "sub-1" | "sub-2" | "sub-3" | "sub-4" | "sub-5";
  chip2: string;
  chip2Color: "point" | "sub-1" | "sub-2" | "sub-3" | "sub-4" | "sub-5";
  description: string;
  iconEmoji?: string;
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
  chip1Color,
  chip2,
  chip2Color,
  description,
  iconEmoji = "📦",
}: TraitTypeCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-gray-02 bg-white p-4">
      {/* Icon + Title */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{iconEmoji}</span>
        <Typography variant="sb3" className="text-gray-09">
          {title}
        </Typography>
      </div>

      {/* Chips */}
      <div className="flex gap-2">
        <Chip className={cn("text-xs", chipBgMap[chip1Color])}>{chip1}</Chip>
        <Chip className={cn("text-xs", chipBgMap[chip2Color])}>{chip2}</Chip>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
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
