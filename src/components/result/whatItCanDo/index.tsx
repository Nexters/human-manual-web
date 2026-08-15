import checkIcon from "@/assets/img/result/check.png";
import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";

interface WhatItCanDoProps {
  can_do: string[];
}

// ------- WhatItCanDo UI ------
export default function WhatItCanDo({ can_do }: WhatItCanDoProps) {
  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="WHAT IT CAN DO" subtitle="이렇게 다뤄주세요" />

      {/* Features List */}
      <div className="flex flex-col gap-3">
        {can_do.map((item) => (
          <div
            key={item}
            className="flex min-h-[46px] items-center gap-4 rounded-[10px] bg-gray-01 px-4 py-2.5"
          >
            <img src={checkIcon} alt="" className="size-9 shrink-0" />
            <Typography variant="me2" className="text-gray-07 break-keep">
              {item}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
