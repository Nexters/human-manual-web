import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import GaugeArc from "./GaugeArc";

// ------- Charging UI ------
export default function Charging() {
  const chargingActivities = [
    { icon: "👨‍👩‍👧", label: "친구끼리 놀기" },
    { icon: "🍺", label: "맥주 한 잔" },
    { icon: "✈️", label: "여행가기" },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="CHARGING" subtitle="충전 방법" />

      {/* Gauge */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex flex-col items-center">
          <GaugeArc value={90} size={160} strokeWidth={10} />
          <div className="absolute inset-0 flex flex-col items-center justify-center top-12">
            <Typography variant="h1" className="text-main">
              90
            </Typography>
          </div>
        </div>

        {/* Description */}
        <Typography variant="me2" className="text-center text-gray-07">
          친구들과 놀 때 가장 배레게 충전돼요
        </Typography>
      </div>

      {/* Charging Activities Grid */}
      <div className="grid grid-cols-3 gap-3">
        {chargingActivities.map((activity) => (
          <div
            key={activity.label}
            className="flex flex-col items-center gap-2 rounded-[12px] border border-gray-02 bg-white p-3"
          >
            <span className="text-3xl">{activity.icon}</span>
            <Typography variant="me3" className="text-center text-gray-08 text-xs">
              {activity.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
