import AssetImage from "@/components/shared/AssetImage";
import Typography from "@/components/shared/Typography";
import { questionAsset } from "@/constants/assets";
import type { ChoiceLayout, ChoiceOption } from "@/constants/questions";
import { cn } from "@/lib/cn";

type ChoiceQuestionProps = {
  questionId: string;
  layout: ChoiceLayout;
  options: ChoiceOption[];
  value?: string;
  onChange: (value: string) => void;
};

const SELECTED_SURFACE = "bg-sub-5 shadow-[inset_0_0_0_2px_var(--color-point)]";

const ChoiceQuestion = ({ questionId, layout, options, value, onChange }: ChoiceQuestionProps) => {
  if (layout === "grid") {
    return (
      <ul className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-[27px]">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-pressed={selected}
                className={cn(
                  "relative size-[159px] rounded-full transition-colors",
                  selected ? SELECTED_SURFACE : "bg-gray-01",
                )}
              >
                <AssetImage
                  src={questionAsset(questionId, option.value)}
                  className="absolute top-[-34px] left-[10px] size-[140px]"
                />
                <Typography
                  variant="sb4"
                  as="span"
                  className={cn(
                    "absolute top-[108px] left-1/2 -translate-x-1/2 whitespace-nowrap",
                    selected ? "text-sub-4" : "text-black",
                  )}
                >
                  {option.label}
                </Typography>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  if (layout === "card") {
    return (
      <ul className="grid grid-cols-2 justify-items-center gap-x-[13px] gap-y-[22px]">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <li key={option.value} className="w-full max-w-[168px]">
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-pressed={selected}
                className={cn(
                  "relative h-[191px] w-full overflow-hidden rounded-[10px] transition-colors",
                  selected ? SELECTED_SURFACE : "bg-gray-01",
                )}
              >
                <AssetImage
                  src={questionAsset(questionId, option.value)}
                  className="absolute inset-x-0 top-[2px] mx-auto h-[150px] w-[160px]"
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 flex h-[37px] items-center justify-center",
                    selected ? "bg-sub-4 text-white" : "bg-gray-02 text-black",
                  )}
                >
                  <Typography variant="sb4" as="span" className="whitespace-nowrap">
                    {option.label}
                  </Typography>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  if (layout === "bubble") {
    return (
      <div className="flex gap-[19px]">
        <AssetImage
          src={questionAsset(questionId, "profile")}
          className="size-[55px] shrink-0 rounded-full"
        />
        <ul className="flex flex-col items-start gap-[18px]">
          {options.map((option) => {
            const selected = value === option.value;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => onChange(option.value)}
                  aria-pressed={selected}
                  className={cn(
                    "flex h-[54px] items-center rounded-[20px] rounded-bl-none px-[18px] transition-colors",
                    selected ? SELECTED_SURFACE : "bg-gray-01",
                  )}
                >
                  <Typography
                    variant="sb3"
                    as="span"
                    className={cn("whitespace-nowrap", selected ? "text-sub-4" : "text-black")}
                  >
                    {option.label}
                  </Typography>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (layout === "chip") {
    return (
      <ul className="grid grid-cols-3 gap-x-2 gap-y-[9px]">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-pressed={selected}
                className={cn(
                  "flex h-[77px] w-full items-center justify-center rounded-[6.586px] px-1 transition-colors",
                  selected ? SELECTED_SURFACE : "bg-gray-01",
                )}
              >
                <Typography
                  variant="sb4"
                  as="span"
                  className={cn(
                    "text-center whitespace-nowrap",
                    selected ? "text-sub-4" : "text-gray-08",
                  )}
                >
                  {option.label}
                </Typography>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  if (layout === "pairCard") {
    return (
      <ul className="flex justify-center gap-[10px]">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-pressed={selected}
                className="flex flex-col items-center"
              >
                {/* 선택/비선택 시안이 카드 안쪽(말풍선·전송 버튼 색)까지 달라서 두 장을 겹쳐 두고 투명도로 전환한다. */}
                <span className="relative block h-[196px] w-[170px]">
                  <AssetImage
                    src={questionAsset(questionId, option.value)}
                    className="absolute inset-0 size-full"
                  />
                  <AssetImage
                    src={questionAsset(questionId, `${option.value}-selected`)}
                    className={cn(
                      "absolute inset-0 size-full transition-opacity",
                      selected ? "opacity-100" : "opacity-0",
                    )}
                  />
                </span>
                <Typography variant="sb4" as="span" className="mt-[14px] text-center text-black">
                  {option.label}
                </Typography>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  if (layout === "duo") {
    return (
      <ul className="flex flex-col gap-[15px]">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-pressed={selected}
                className={cn(
                  "flex min-h-[94px] w-full items-center justify-center rounded-[10px] px-5 transition-colors",
                  selected ? SELECTED_SURFACE : "bg-gray-01",
                )}
              >
                <Typography
                  variant="sb4"
                  as="span"
                  className={cn(
                    "text-center whitespace-pre-line",
                    selected ? "text-sub-4" : "text-black",
                  )}
                >
                  {option.label}
                </Typography>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  const twoLine = options.some((option) => option.label.includes("\n"));

  return (
    <ul className={cn("flex flex-col", twoLine ? "gap-3" : "gap-2")}>
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={cn(
                "flex w-full items-center rounded-[10px] px-5 text-left transition-colors",
                twoLine ? "min-h-[94px] py-5" : "min-h-[62px] py-[17px]",
                selected ? SELECTED_SURFACE : twoLine ? "bg-gray-00" : "bg-gray-01",
              )}
            >
              <Typography
                variant="sb3"
                as="span"
                className={cn("flex-1 whitespace-pre-line", selected ? "text-sub-4" : "text-black")}
              >
                {option.label}
              </Typography>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ChoiceQuestion;
