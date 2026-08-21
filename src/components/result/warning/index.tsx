import errorIcon from "@/assets/img/result/error.png";
import Typography from "@/components/shared/Typography";
import SectionTitle from "@/components/result/SectionTitle";

interface WarningProps {
  warnings: string[];
}

// ------- Warning UI ------
export default function Warning({ warnings }: WarningProps) {
  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* ----- 상단 타이틀 섹션 ----- */}
      <SectionTitle title="이렇게 하면 고장나요" subtitle="나를 지치게 만드는 행동들이에요" />

      {/* ----- 주의사항 리스트 ----- */}
      <div className="flex flex-col gap-3">
        {warnings.map((warning) => (
          <div
            key={warning}
            className="flex min-h-[46px] items-center gap-4 rounded-[10px] bg-gray-01 px-4 py-2.5"
          >
            <img src={errorIcon} alt="" className="size-9 shrink-0" />
            <Typography variant="me2" className="text-gray-07 break-keep">
              {warning}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
