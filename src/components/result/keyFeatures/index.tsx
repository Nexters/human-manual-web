import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import fireIcon from "@/assets/img/result/keyFeature/fire.png";
import smileIcon from "@/assets/img/result/keyFeature/smile.png";
import starIcon from "@/assets/img/result/keyFeature/star.png";
import searchIcon from "@/assets/img/result/keyFeature/search.png";
import type { FeatureOutput } from "@/types/assessment";

interface KeyFeaturesProps {
  features: FeatureOutput[];
  imageUrl: string;
  storyTitle: string;
  storyDescription: string;
}

const FEATURE_ICONS = [fireIcon, smileIcon, starIcon, searchIcon] as const;

function getFeatureIcon(index: number): string {
  return FEATURE_ICONS[index] ?? FEATURE_ICONS[FEATURE_ICONS.length - 1];
}

// ------- KeyFeatures UI ------
export default function KeyFeatures({
  features,
  imageUrl,
  storyTitle,
  storyDescription,
}: KeyFeaturesProps) {
  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="KEY FEATURES" subtitle="어떤 특징을 가지고 있나요?" />

      {/* ----- 장난감 이미지 섹션 ----- */}
      <div className="flex items-center justify-center">
        <img src={imageUrl} alt="장난감" className="w-full max-w-[280px] object-contain" />
      </div>

      {/* ----- 특징 카드 그리드 (2x2) ----- */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="flex items-center gap-3 rounded-[10px] bg-white px-1.5 py-3"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-02 bg-gray-01">
              <img src={getFeatureIcon(index)} alt="" className="size-8 object-contain" />
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="sb4" className="text-gray-09 break-keep">
                {feature.title}
              </Typography>
              <Typography variant="me4" className="text-gray-06 break-keep">
                {feature.description}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      {/* ----- 안내 텍스트 ----- */}
      <div className="flex flex-col justify-center gap-2 rounded-[10px] bg-gray-01 p-4 mt-[40px]">
        <Typography variant="sb3" className="text-gray-09 text-center break-keep">
          {storyTitle}
        </Typography>
        <Typography variant="me2" className="text-center text-gray-07 break-keep">
          {storyDescription}
        </Typography>
      </div>
    </div>
  );
}
