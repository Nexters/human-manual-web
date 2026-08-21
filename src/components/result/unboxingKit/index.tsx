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
    <div className="flex flex-col gap-6 px-5 py-8  mt-[30px]">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="UNBOXING KIT" subtitle="나는 어떤 장난감이에요" />

      {/* ----- 성향 슬라이더 ----- */}
      <div className="flex flex-col gap-6">
        <TraitSlider
          label1="밀착"
          label2="거리조절"
          value={axis_scores.attachment}
          isLabel1HighEnd={true}
          description1="자주 연락해야 안심, 같이 있는 게 충전"
          description2="각자의 시간 필수, 애정과 독립은 별개"
        />
        <TraitSlider
          label1="탐색"
          label2="직진"
          value={axis_scores.expression}
          isLabel1HighEnd={false}
          description1="호기심이 생기면 이리저리 살펴보기"
          description2="한 가지를 집중해서 파고들기"
        />
        <TraitSlider
          label1="탐험"
          label2="루틴"
          value={axis_scores.routine}
          isLabel1HighEnd={false}
          description1="새로운 것에 도전하는 것이 재미"
          description2="익숙한 것이 편하고 안전해"
        />
        <TraitSlider
          label1="테토"
          label2="에겐"
          value={axis_scores.egen}
          isLabel1HighEnd={false}
          description1="변화가 많고 예측 불가능한 성격"
          description2="일관되고 예측 가능한 성격"
        />
      </div>

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
  );
}
