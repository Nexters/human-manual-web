import AssetImage from "@/components/shared/AssetImage";
import Typography from "@/components/shared/Typography";
import { CONSTRAINTS } from "@/constants/assessment";
import { questionAsset } from "@/constants/assets";
import { cn } from "@/lib/cn";

type IntegerQuestionProps = {
  questionId: string;
  value?: number;
  onChange: (value: number | undefined) => void;
};

const IntegerQuestion = ({ questionId, value, onChange }: IntegerQuestionProps) => {
  const constraint = CONSTRAINTS[questionId] ?? { minimum: 0, maximum: 999, step: 1 };

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits === "") {
      onChange(undefined);
      return;
    }
    const parsed = Number(digits);
    if (parsed < constraint.minimum || parsed > constraint.maximum) return;
    onChange(parsed);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[96px]">
      <div className="relative">
        <AssetImage
          src={questionAsset(questionId, "main")}
          className="size-[124px] rounded-[20px]"
        />
        <span className="absolute top-[-18px] right-[-32px] flex h-[41px] w-[76px] items-center justify-center rounded-[50px] bg-badge-red">
          <Typography variant="h1" as="span" className="text-white">
            {value ?? ""}
          </Typography>
        </span>
      </div>

      <label className="border-gray-03 flex h-[54px] w-full cursor-text items-center rounded-[10px] border bg-white px-3 py-2.5">
        <input
          inputMode="numeric"
          value={value ?? ""}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={`${constraint.minimum} ~ ${constraint.maximum}까지 입력할 수 있어요`}
          aria-label={`${constraint.minimum}~${constraint.maximum} 사이 숫자 입력`}
          className={cn(
            "text-gray-09 placeholder:text-gray-06 placeholder:font-medium text-[18px] leading-[1.5] font-bold tracking-[-0.72px] outline-none",
            value === undefined && "w-full",
          )}
          style={value === undefined ? undefined : { width: `${String(value).length}ch` }}
        />
        {value !== undefined && (
          <>
            <Typography variant="h3" as="span" className="text-gray-09">
              개
            </Typography>
            <span className="flex-1" aria-hidden />
          </>
        )}
      </label>
    </div>
  );
};

export default IntegerQuestion;
