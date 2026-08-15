import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";
import TraitSlider from "./TraitSlider";
import TraitTypeCard from "./TraitTypeCard";
import boxImg from "@/assets/images/result/unboxing/box.png";
import magicStickImg from "@/assets/images/result/unboxing/magic_stick.png";

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
        "당신은 애정과 관심을 아낌없이 표현하고, 감정도 솔직하게 드러내요. 마음을 크게 담은 만큼 작은 반응에도 쉽게 기뻐하거나 서운해지는 취급주의 상자예요.",
      image: boxImg,
    },
    {
      title: "마술봉",
      chip1: "탐험형",
      chip1Color: "sub-3" as const,
      chip2: "에겐형",
      chip2Color: "sub-4" as const,
      description:
        "당신은 호기심이 생기면 망설이지 않고 새로운 경험에 뛰어들어요. 평범한 순간도 자신만의 방식으로 흥미롭게 바꾸는 모습이 마술봉과 닮았어요.",
      image: magicStickImg,
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
          value={65}
          description1="자주 연락해야 안심, 같이 있는 게 충전"
          description2="각자의 시간 필수, 애정과 독립은 별개"
        />
        <TraitSlider
          label1="탐색"
          label2="직진"
          value={45}
          description1="호기심이 생기면 이리저리 살펴보기"
          description2="한 가지를 집중해서 파고들기"
        />
        <TraitSlider
          label1="탐험"
          label2="루틴"
          value={72}
          description1="새로운 것에 도전하는 것이 재미"
          description2="익숙한 것이 편하고 안전해"
        />
        <TraitSlider
          label1="테토"
          label2="에겐"
          value={58}
          description1="변화가 많고 예측 불가능한 성격"
          description2="일관되고 예측 가능한 성격"
        />
      </div>

      {/* Info Text */}
      <div className="flex flex-col gap-2 rounded-[10px] bg-gray-01 p-4">
        <Typography variant="sb3" className="text-gray-09">
          밤이 깊어질수록 텐션이 올라가는 장난꾸러기
        </Typography>
        <Typography variant="me2" className="text-center text-gray-07">
          해가 지면 비로소 에너지가 충전되는 타입. 엉뚱한 장난과 재치 있는 말로 조용하던 분위기를
          뒤집고, 모두가 지칠 때쯤 신나게 놀기 시작해요.
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
            image={trait.image}
          />
        ))}
      </div>
    </div>
  );
}
