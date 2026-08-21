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
      chip1: packaging.tags[0] ?? "",
      chip2: packaging.tags[1] ?? "",
      description: packaging.reason,
      image: packaging.image_url,
    },
    {
      title: opening_tool.name,
      chip1: opening_tool.tags[0] ?? "",
      chip2: opening_tool.tags[1] ?? "",
      description: opening_tool.reason,
      image: opening_tool.image_url,
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8  mt-[30px]">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="UNBOXING KIT" subtitle="나는 어떤 장난감이에요" />

      {/* ----- 성향 슬라이더 -----
          axis_scores 값은 항상 rightLabel(100점 방향)의 강도를 뜻한다. */}
      <div className="flex flex-col gap-6">
        <TraitSlider
          leftLabel="거리조절"
          rightLabel="밀착"
          value={axis_scores.attachment}
          leftDescription="각자의 시간 필수, 애정과 독립은 별개"
          rightDescription="자주 연락해야 안심, 같이 있는 게 충전"
        />
        <TraitSlider
          leftLabel="탐색"
          rightLabel="직진"
          value={axis_scores.expression}
          leftDescription="호기심이 생기면 이리저리 살펴보기"
          rightDescription="한 가지를 집중해서 파고들기"
        />
        <TraitSlider
          leftLabel="탐험"
          rightLabel="루틴"
          value={axis_scores.routine}
          leftDescription="새로운 것에 도전하는 것이 재미"
          rightDescription="익숙한 것이 편하고 안전해"
        />
        <TraitSlider
          leftLabel="테토"
          rightLabel="에겐"
          value={axis_scores.egen}
          leftDescription="변화가 많고 예측 불가능한 성격"
          rightDescription="일관되고 예측 가능한 성격"
        />
      </div>

      {/* ----- 성향 타입 카드 ----- */}
      <div className="flex flex-col gap-4">
        {traits.map((trait) => (
          <TraitTypeCard
            key={trait.title}
            title={trait.title}
            chip1={trait.chip1}
            chip2={trait.chip2}
            description={trait.description}
            image={trait.image}
          />
        ))}
      </div>
    </div>
  );
}
