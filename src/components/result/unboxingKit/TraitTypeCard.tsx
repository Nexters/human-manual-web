import Typography from "@/components/shared/Typography";

type TraitTypeCardProps = {
  title: string;
  description: string;
  image: string;
};

export default function TraitTypeCard({ title, description, image }: TraitTypeCardProps) {
  return (
    <div className="flex flex-col gap-6 mt-[30px]">
      {/* ----- 이미지 & 타이틀 ----- */}
      <div className="flex flex-col items-center gap-3">
        <img src={image} alt={title} className="w-24 h-24 object-contain" />
        <Typography variant="sb2" className="text-gray-09">
          {title}
        </Typography>
      </div>

      {/* ----- 설명 박스 ----- */}
      <div className="flex flex-col gap-2 rounded-[12px] bg-white p-4 mt-6">
        <Typography variant="sb3" className="text-main">
          왜 {title}인가요?
        </Typography>
        <Typography variant="me3" className="text-gray-06 break-keep">
          {description}
        </Typography>
      </div>
    </div>
  );
}
