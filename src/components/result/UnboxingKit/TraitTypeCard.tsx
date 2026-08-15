import Typography from "@/components/shared/Typography";

type TraitTypeCardProps = {
  title: string;
  chip1: string;
  chip2: string;
  description: string;
  image: string;
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
          <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-sub-5 text-point text-xs font-medium">
            {chip1}
          </span>
          <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-sub-5 text-point text-xs font-medium">
            {chip2}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 rounded-[12px] bg-white p-4 mt-6">
        <Typography variant="sb3" className="text-main">
          왜 {title}인가요?
        </Typography>
        <Typography variant="me3" className="text-gray-06">
          {description}
        </Typography>
      </div>
    </div>
  );
}
