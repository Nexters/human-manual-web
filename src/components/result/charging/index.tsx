import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { getChargingActivityIcon } from "@/constants/chargingActivityIcons";
import GaugeArc from "./GaugeArc";
import type { ChargingOutput } from "@/types/assessment";

interface ChargingProps {
  charging: ChargingOutput;
}

const IN_VIEW_OPTIONS = { threshold: 0.4 };

// ------- Charging UI ------
export default function Charging({ charging }: ChargingProps) {
  const { score, description, activities } = charging;
  const { ref, isInView } = useInView<HTMLDivElement>(IN_VIEW_OPTIONS);
  const count = useCountUp(score, isInView);

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="CHARGING" subtitle="충전 방법" />

      {/* Gauge */}
      <div ref={ref} className="flex flex-col items-center gap-4">
        <div className="relative flex flex-col items-center">
          <GaugeArc value={isInView ? score : 0} size={220} strokeWidth={12} />
          <div className="absolute inset-0 flex flex-col items-center justify-center top-8">
            <p
              className="text-center text-main"
              style={{
                fontFamily: "'ThePosterFont', var(--font-sans)",
                fontSize: "74.3px",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "-2%",
              }}
            >
              {count}
            </p>
          </div>
        </div>

        {/* Description */}
        <Typography variant="sb3" className="text-center text-gray-08 break-keep">
          {description}
        </Typography>
      </div>

      {/* Charging Activities Grid */}
      <div className="grid grid-cols-3 gap-3">
        {activities.map((activity) => (
          <div
            key={activity.label}
            className="flex flex-col items-center gap-2 rounded-[12px] border border-gray-02 bg-white p-3"
          >
            <img
              src={getChargingActivityIcon(activity.type)}
              alt={activity.label}
              className="size-20 shrink-0"
            />
            <Typography variant="me3" className="text-center text-gray-08 text-xs break-keep">
              {activity.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
