import errorIcon from "@/assets/images/result/error.png";
import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";

// ------- Warning UI ------
export default function Warning() {
  const warnings = [
    "똑같은 일만 반복시켜요",
    "선택을 지나치게 제한해요",
    "재미없는 분위기를 오래 끌어요",
    "아이디어를 시작부터 막아버려요",
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="WARNING" subtitle="이렇게 하면 고장나요" />

      {/* Warnings List */}
      <div className="flex flex-col gap-3">
        {warnings.map((warning) => (
          <div
            key={warning}
            className="flex h-[46px] items-center gap-4 rounded-[10px] bg-gray-01 px-4"
          >
            <img src={errorIcon} alt="" className="size-9 shrink-0" />
            <Typography variant="me2" className="text-gray-07">
              {warning}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
