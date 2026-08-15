import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import topToyImg from "@/assets/images/result/toy/top.png";
import fireIcon from "@/assets/images/result/keyFeature/fire.png";
import smileIcon from "@/assets/images/result/keyFeature/smile.png";
import starIcon from "@/assets/images/result/keyFeature/star.png";
import searchIcon from "@/assets/images/result/keyFeature/search.png";

// ------- KeyFeatures UI ------
export default function KeyFeatures() {
  const features = [
    { icon: fireIcon, title: "분위기를 띄워요", description: "생각보다 빠른 행동력" },
    { icon: smileIcon, title: "일단 해봐요", description: "생각보다 빠른 행동력" },
    { icon: starIcon, title: "변화를 즐겨요", description: "새로운 방식에 열린 태도" },
    { icon: searchIcon, title: "탐험형", description: "직접 부딪히며 발견" },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="KEY FEATURES" subtitle="어떤 특징을 가지고 있나요?" />

      {/* Feature Image */}
      <div className="flex items-center justify-center">
        <img src={topToyImg} alt="장난감" className="w-full max-w-[280px] object-contain" />
      </div>

      {/* Features Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-center gap-3 rounded-[10px] bg-white p-4"
          >
            <img src={feature.icon} alt="" className="size-10 object-contain shrink-0" />
            <div className="flex flex-col gap-1">
              <Typography variant="sb4" className="text-gray-09">
                {feature.title}
              </Typography>
              <Typography variant="me4" className="text-gray-06">
                {feature.description}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
