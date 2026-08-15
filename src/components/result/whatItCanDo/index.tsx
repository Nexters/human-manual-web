import checkIcon from "@/assets/images/result/check.png";
import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";

// ------- WhatItCanDo UI ------
export default function WhatItCanDo() {
  const features = [
    "같이 놀아주세요",
    "새로운 제안을 던져주세요",
    "리액션을 아끼지 말아주세요",
    "자유롭게 맡겨주세요",
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="WHAT IT CAN DO" subtitle="이렇게 다뤄주세요" />

      {/* Features List */}
      <div className="flex flex-col gap-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex h-[46px] items-center gap-4 rounded-[10px] bg-gray-01 px-4"
          >
            <img src={checkIcon} alt="" className="size-9 shrink-0" />
            <Typography variant="me2" className="text-gray-07">
              {feature}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
