import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import type { FeatureOutput } from "@/types/assessment";

interface KeyFeaturesProps {
  features: FeatureOutput[];
  imageUrl: string;
  storyTitle: string;
  storyDescription: string;
}

// TODO: 백엔드에서 태그별 배경색/글자색 필드를 내려주면 feature.tag_bg_color, feature.tag_text_color로 교체
const TAG_COLORS = [
  { bg: "#FFE0E0", text: "#B21200" },
  { bg: "#E6E0FF", text: "#5F00B2" },
  { bg: "#E0F3FF", text: "#0068B2" },
  { bg: "#FFEFE0", text: "#B26B00" },
] as const;
const DEFAULT_TAG = "열정";

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
      <SectionTitle title="핵심 특징" subtitle="나를 기분 좋게 만드는 행동들이에요" />

      {/* ----- 장난감 이미지 섹션 ----- */}
      <div className="flex items-center justify-center">
        <img src={imageUrl} alt="장난감" className="w-full max-w-[280px] object-contain" />
      </div>

      {/* ----- 특징 카드 리스트 ----- */}
      <div className="flex flex-col gap-2">
        {features.map((feature, index) => {
          const tagColor = TAG_COLORS[index % TAG_COLORS.length];
          return (
            <div
              key={feature.title}
              className="flex flex-col gap-2 rounded-[10px] bg-white px-3.5 py-3"
            >
              <span
                className="inline-flex w-fit items-center rounded-[5px] px-2 py-0.5"
                style={{ backgroundColor: tagColor.bg, color: tagColor.text }}
              >
                <Typography variant="me3" as="span">
                  {feature.tag || DEFAULT_TAG}
                </Typography>
              </span>
              <div className="flex flex-col gap-1">
                <Typography variant="sb4" className="text-gray-09 break-keep">
                  {feature.title}
                </Typography>
                <Typography variant="me3" className="text-gray-07 break-keep">
                  {feature.description}
                </Typography>
              </div>
            </div>
          );
        })}
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
