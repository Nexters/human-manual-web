import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

// ------- WhatItCanDo UI ------
export default function WhatItCanDo() {
  const features = [
    "같이 놀아주세요",
    "새로운 재칭을 단서주세요",
    "리/섬돈 이미지 읽게세요",
    "자동을 끼칭주세요",
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* Title */}
      <Typography variant="h2" className="text-center text-gray-09 uppercase">
        WHAT IT CAN DO
      </Typography>
      <Typography variant="me2" className="text-center text-gray-07">
        이렇게 다뤄주세요
      </Typography>

      {/* Features List */}
      <div className="flex flex-col gap-3">
        {features.map((feature) => (
          <div
            key={feature}
            className={cn(
              "flex items-center gap-4 rounded-[10px] bg-gray-00 p-4",
              "border border-gray-02"
            )}
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-main">
              <span className="text-sm text-white">✓</span>
            </div>
            <Typography variant="me2" className="text-gray-08">
              {feature}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
