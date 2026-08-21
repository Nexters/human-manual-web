import { useEffect } from "react";
import Typography from "@/components/shared/Typography";
import { CONSTRAINTS } from "@/constants/assessment";
import { cn } from "@/lib/cn";

type ScaleQuestionProps = {
  questionId: string;
  minLabel: string;
  maxLabel: string;
  value?: number;
  onChange: (value: number) => void;
};

const THUMB_SIZE = 19;

const ScaleQuestion = ({ questionId, minLabel, maxLabel, value, onChange }: ScaleQuestionProps) => {
  const constraint = CONSTRAINTS[questionId] ?? { minimum: 0, maximum: 100, step: 1 };
  const current = value ?? constraint.minimum;
  const ratio = (current - constraint.minimum) / (constraint.maximum - constraint.minimum);

  useEffect(() => {
    if (value === undefined) onChange(constraint.minimum);
  }, [value, constraint.minimum, onChange]);

  const thumbCenter = `calc((100% - ${THUMB_SIZE}px) * ${ratio} + ${THUMB_SIZE / 2}px)`;

  return (
    <div className="relative h-[87px] w-full">
      <div className="relative h-[55px] w-full">
        <div className="bg-gray-01 absolute inset-x-0 bottom-0 h-[10px] rounded-[7.5px]" />
        <div
          className="bg-point absolute bottom-0 left-0 h-[10px] rounded-[7.5px]"
          style={{ width: thumbCenter }}
        />

        <span
          className="absolute bottom-[-10px] size-[31px] -translate-x-1/2 rounded-full"
          style={{
            left: thumbCenter,
            background:
              "radial-gradient(circle, var(--color-point) 0%, color-mix(in srgb, var(--color-point) 10%, transparent) 100%)",
          }}
        />
        <span
          className="absolute bottom-[-4px] size-[19px] -translate-x-1/2 rounded-full bg-white"
          style={{ left: thumbCenter }}
        />

        <input
          type="range"
          min={constraint.minimum}
          max={constraint.maximum}
          step={constraint.step}
          value={current}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={`${minLabel} ~ ${maxLabel}`}
          className="absolute inset-x-0 bottom-[-10px] h-[30px] w-full cursor-pointer opacity-0"
        />
      </div>

      <Typography
        variant="sb4"
        as="span"
        className={cn(
          "absolute top-[63px] left-0 whitespace-nowrap",
          ratio < 0.5 ? "text-sub-4" : "text-gray-07",
        )}
      >
        {minLabel}
      </Typography>
      <Typography
        variant="sb4"
        as="span"
        className={cn(
          "absolute top-[63px] right-0 whitespace-nowrap",
          ratio >= 0.5 ? "text-sub-4" : "text-gray-07",
        )}
      >
        {maxLabel}
      </Typography>
    </div>
  );
};

export default ScaleQuestion;
