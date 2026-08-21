import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import Chip from "@/components/shared/Chip";
import chargeImg from "@/assets/img/result/charge/charge.png";
import type { ChargingOutput } from "@/types/assessment";

interface ChargingProps {
  charging: ChargingOutput;
}

// ------- Charging UI ------
export default function Charging({ charging }: ChargingProps) {
  const { description, activities } = charging;

  return (
    <div className="flex flex-col gap-6 px-5 py-8 mt-10 mb-10">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="충전 방법" subtitle="나를 충전하는 방법" />

      {/* ----- 충전 이미지 & 설명 ----- */}
      <div className="flex flex-col items-center gap-4">
        <img src={chargeImg} alt="충전 방법" className="size-[220px] object-contain" />

        <Typography variant="sb3" className="text-center text-gray-08 break-keep">
          {description}
        </Typography>
      </div>

      {/* ----- 충전 활동 목록 ----- */}
      <div className="flex flex-wrap justify-center gap-2">
        {activities.map((activity) => (
          <Chip key={activity.label} variant="me3" className="bg-white text-gray-07">
            {activity.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
