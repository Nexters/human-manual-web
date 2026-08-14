import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

// ------- Warning UI ------
export default function Warning() {
  const warnings = [
    "뚝딱은 원인 반복시켜요",
    "손택은 자내게 제한돼요",
    "제마없는 문위기를 옮겨 찾아요",
    "아이디옆을 시작부터 맞비려요",
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-8">
      {/* Title */}
      <Typography variant="h2" className="text-center text-gray-09 uppercase">
        WARNING
      </Typography>
      <Typography variant="me2" className="text-center text-gray-07">
        이렇게 취한 고주나요
      </Typography>

      {/* Warnings List */}
      <div className="flex flex-col gap-3">
        {warnings.map((warning) => (
          <div
            key={warning}
            className={cn(
              "flex items-center gap-4 rounded-[10px] bg-gray-00 p-4",
              "border border-gray-02"
            )}
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-point">
              <span className="text-sm text-white font-bold">✕</span>
            </div>
            <Typography variant="me2" className="text-gray-08">
              {warning}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
