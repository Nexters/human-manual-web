import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import TraitSlider from "./TraitSlider";
import TraitTypeCard from "./TraitTypeCard";

// ------- UnboxingKit UI ------
export default function UnboxingKit() {
  const traits = [
    {
      title: "취급주의 상자",
      chip1: "직진형",
      chip1Color: "sub-2" as const,
      chip2: "거리조절형",
      chip2Color: "sub-1" as const,
      description:
        "해기 지면 비동수 에너지가 충족되는 타입. 앞두기 자칠 범을 새로게 걸었던 목표지를 위정고, 또 두가지 페기가 자칠 범을 새로게.",
      iconEmoji: "📦",
    },
    {
      title: "마술봉",
      chip1: "탐험형",
      chip1Color: "sub-3" as const,
      chip2: "에겐형",
      chip2Color: "sub-4" as const,
      description:
        "당신은 궁금함 생기면 달려가 새로운 경험에 뛰어드는 유형이 아닐까요 새로운 곳 경험에 데려 두가지 개기가 자칠 범을 새로게.",
      iconEmoji: "✨",
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8 bg-gray-00">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="UNBOXING KIT" subtitle="나는 어떤 장난감이에요" />

      {/* Trait Sliders */}
      <div className="flex flex-col gap-6">
        <TraitSlider label1="밀착" label2="거리조절" value={65} />
        <TraitSlider label1="탐색" label2="직진" value={45} />
        <TraitSlider label1="탐험" label2="루틴" value={72} />
        <TraitSlider label1="테토" label2="에겐" value={58} />
      </div>

      {/* Info Text */}
      <div className="rounded-[10px] bg-white p-4">
        <Typography variant="me3" className="text-gray-08 leading-relaxed">
          밥이 궁금해지면 탱구어 달려가 장난감과 함께하는 당신파를 위정고, 또 두가지 개기가 자칠
          범을 새로게.
        </Typography>
      </div>

      {/* Trait Cards */}
      <div className="flex flex-col gap-4">
        {traits.map((trait) => (
          <TraitTypeCard
            key={trait.title}
            title={trait.title}
            chip1={trait.chip1}
            chip1Color={trait.chip1Color}
            chip2={trait.chip2}
            chip2Color={trait.chip2Color}
            description={trait.description}
            iconEmoji={trait.iconEmoji}
          />
        ))}
      </div>
    </div>
  );
}
