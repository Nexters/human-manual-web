import Typography from "@/components/shared/Typography";
import Chip from "@/components/shared/Chip";
import Button from "@/components/shared/Button";

// ------- Compatible UI ------
export default function Compatible() {
  const characters = [
    {
      name: "비둘 상자",
      description: "당신의 아이디를 같이 이해하고 함께일 수 있는",
      emoji: "🎁",
      chipColor: "bg-main text-white",
    },
    {
      name: "곰인형",
      description: "쭈종적인 상님과 인정적인 친구는 속도가 탁월해",
      emoji: "🧸",
      chipColor: "bg-point text-white",
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8 bg-gray-00">
      {/* Title */}
      <Typography variant="h2" className="text-center text-gray-09 uppercase">
        COMPATIBLE
      </Typography>
      <Typography variant="me2" className="text-center text-gray-07">
        나와 잘 맞는 친구 궁합
      </Typography>

      {/* Category Chips */}
      <div className="flex gap-2 justify-center">
        <Chip className="bg-main text-white">환상의 장난감</Chip>
        <Chip className="bg-point text-white">환장의 장난감</Chip>
      </div>

      {/* Character Cards */}
      <div className="flex flex-col gap-4">
        {characters.map((character) => (
          <div key={character.name} className="flex flex-col gap-3 rounded-[12px] bg-white p-4">
            {/* Character Image Placeholder */}
            <div className="w-full aspect-square bg-gray-02 rounded-[12px] flex items-center justify-center">
              <span className="text-5xl">{character.emoji}</span>
            </div>

            {/* Name & Description */}
            <Typography variant="sb3" className="text-gray-09">
              {character.name}
            </Typography>
            <Typography variant="me3" className="text-gray-07 leading-relaxed">
              {character.description}
            </Typography>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <Button className="w-full">친구 궁합 자세히 보기</Button>
      </div>
    </div>
  );
}
