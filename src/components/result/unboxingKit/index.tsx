import SectionTitle from "@/components/result/SectionTitle";
import TraitSlider from "./TraitSlider";
import TraitTypeCard from "./TraitTypeCard";
import type { UnboxingKitOutput } from "@/types/assessment";

interface UnboxingKitProps {
  unboxingKit: UnboxingKitOutput;
}

// ------- UnboxingKit UI ------
export default function UnboxingKit({ unboxingKit }: UnboxingKitProps) {
  const { axis_scores, packaging, opening_tool } = unboxingKit;

  const traits = [
    {
      title: packaging.name,
      description: packaging.reason,
      image: packaging.image_url,
    },
    {
      title: opening_tool.name,
      description: opening_tool.reason,
      image: opening_tool.image_url,
    },
  ];

  return (
    <>
      {/* ----- 언박싱 키트 섹션 ----- */}
      <div className="flex flex-col gap-6 px-5 py-8 mt-[30px]">
        <SectionTitle title="언박싱 키트" subtitle="내 포장 상자와, 그걸 여는 도구에요" />

        {/* ----- 성향 타입 카드 ----- */}
        <div className="flex flex-col gap-4">
          {traits.map((trait) => (
            <TraitTypeCard
              key={trait.title}
              title={trait.title}
              description={trait.description}
              image={trait.image}
            />
          ))}
        </div>
      </div>

      {/* ----- 성향 분석 섹션 ----- */}
      <div className="flex flex-col gap-6 px-5 py-8">
        <SectionTitle title="성향 분석" subtitle="나는 이런 사람이에요" />

        {/* ----- 성향 슬라이더 -----
            axis_scores 값은 항상 rightLabel(100점 방향)의 강도를 뜻한다. */}
        <div className="flex flex-col gap-6">
          <TraitSlider
            leftLabel="거리조절"
            rightLabel="밀착"
            value={axis_scores.attachment}
            leftDescription="각자의 시간은 꼭 필요해요"
            rightDescription="함께 있는 시간이 힘이 돼요"
          />
          <TraitSlider
            leftLabel="탐색"
            rightLabel="직진"
            value={axis_scores.expression}
            leftDescription="돌려서 말하는 게 편해요"
            rightDescription="속마음을 숨김없이 말해요"
          />
          <TraitSlider
            leftLabel="탐험"
            rightLabel="루틴"
            value={axis_scores.routine}
            leftDescription="새로운 도전이 제일 재밌어요"
            rightDescription="익숙한 게 편하고 안심돼요"
          />
          <TraitSlider
            leftLabel="테토"
            rightLabel="에겐"
            value={axis_scores.egen}
            leftDescription="표현은 서툴러도 마음은 진심이에요"
            rightDescription="감정도 섬세하게 표현하는 편이에요"
          />
        </div>
      </div>
    </>
  );
}
