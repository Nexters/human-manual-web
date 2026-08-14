import Typography from "@/components/shared/Typography";
import InfoCard from "@/components/shared/InfoCard";

// ------- KeyFeatures UI ------
export default function KeyFeatures() {
  const features = [
    {
      icon: "🔥",
      title: "분위기를 위해요",
      description: "생긴곡 때문 뭔들레",
    },
    {
      icon: "😊",
      title: "입딘 해해요",
      description: "생긴곡때 때문 뭔들레",
    },
    {
      icon: "⭐",
      title: "변혁을 좋아요",
      description: "새로운 방식에 열린 태도",
    },
    {
      icon: "🔍",
      title: "탐험정",
      description: "직접 우피머 냐걸",
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* Title */}
      <Typography variant="h2" className="text-center text-gray-09 uppercase">
        KEY FEATURES
      </Typography>
      <Typography variant="me2" className="text-center text-gray-07">
        어떤 특징이 가지고 있나요?
      </Typography>

      {/* Feature Image Placeholder */}
      <div className="w-full aspect-video bg-gray-02 rounded-[12px] flex items-center justify-center">
        <span className="text-5xl">🎪</span>
      </div>

      {/* Features Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex">
            <InfoCard
              icon={<span className="text-2xl">{feature.icon}</span>}
              title={feature.title}
              description={feature.description}
              className="flex-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
