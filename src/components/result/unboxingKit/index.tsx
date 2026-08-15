import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import TraitSlider from "./TraitSlider";
import TraitTypeCard from "./TraitTypeCard";
import { PACKAGING_IMAGE_MAP, OPENING_TOOL_IMAGE_MAP } from "@/constants/unboxingKitImages";
import type { UnboxingKitOutput } from "@/types/assessment";

interface UnboxingKitProps {
  unboxingKit: UnboxingKitOutput;
}

// ------- UnboxingKit UI ------
export default function UnboxingKit({ unboxingKit }: UnboxingKitProps) {
  const { axis_scores, title, description, packaging, opening_tool } = unboxingKit;

  const traits = [
    {
      title: packaging.name,
      chip1: packaging.tags[0] ?? "",
      chip2: packaging.tags[1] ?? "",
      description: packaging.reason,
      image: PACKAGING_IMAGE_MAP[packaging.type],
    },
    {
      title: opening_tool.name,
      chip1: opening_tool.tags[0] ?? "",
      chip2: opening_tool.tags[1] ?? "",
      description: opening_tool.reason,
      image: OPENING_TOOL_IMAGE_MAP[opening_tool.type],
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8  mt-[30px]">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="UNBOXING KIT" subtitle="나는 어떤 장난감이에요" />

      {/* Trait Sliders */}
      <div className="flex flex-col gap-6">
        <TraitSlider
          label1="밀착"
          label2="거리조절"
          value={axis_scores.attachment}
          description1="자주 연락해야 안심, 같이 있는 게 충전"
          description2="각자의 시간 필수, 애정과 독립은 별개"
        />
        <TraitSlider
          label1="탐색"
          label2="직진"
          value={100 - axis_scores.expression}
          description1="호기심이 생기면 이리저리 살펴보기"
          description2="한 가지를 집중해서 파고들기"
        />
        <TraitSlider
          label1="탐험"
          label2="루틴"
          value={100 - axis_scores.routine}
          description1="새로운 것에 도전하는 것이 재미"
          description2="익숙한 것이 편하고 안전해"
        />
        <TraitSlider
          label1="테토"
          label2="에겐"
          value={100 - axis_scores.egen}
          description1="변화가 많고 예측 불가능한 성격"
          description2="일관되고 예측 가능한 성격"
        />
      </div>

      {/* Info Text */}
      <div className="flex flex-col justify-center gap-2 rounded-[10px] bg-gray-01 p-4 mt-[40px]">
        <Typography variant="sb3" className="text-gray-09 text-center">
          {title}
        </Typography>
        <Typography variant="me2" className="text-center text-gray-07">
          {description}
        </Typography>
      </div>

      {/* Trait Cards */}
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
