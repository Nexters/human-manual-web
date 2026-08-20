import Typography from "@/components/shared/Typography";
import { MBTI_AXES } from "@/types/assessment";
import type { MbtiAxisKey, MbtiSelection } from "@/types/assessment";
import { cn } from "@/lib/cn";

type MbtiSelectorProps = {
  value: MbtiSelection;
  onChange: (axis: MbtiAxisKey, pole: string) => void;
};

const MbtiSelector = ({ value, onChange }: MbtiSelectorProps) => {
  return (
    <div className="flex flex-col gap-[27px]">
      {MBTI_AXES.map((axis) => (
        <fieldset key={axis.key}>
          <legend className="mb-[15px] w-full text-center">
            <Typography variant="sb4" as="span" className="text-black">
              {axis.label}
            </Typography>
          </legend>

          <div className="flex gap-[14px]">
            {axis.poles.map((pole, poleIndex) => {
              const selected = value[axis.key] === pole;

              return (
                <button
                  key={pole}
                  type="button"
                  onClick={() => onChange(axis.key, pole)}
                  aria-pressed={selected}
                  className={cn(
                    "h-[45px] flex-1 rounded-[6px] border-[1.5px] transition-colors",
                    selected
                      ? "bg-sub-5 border-point text-sub-4"
                      : "bg-gray-01 text-gray-05 border-transparent",
                  )}
                >
                  <Typography variant="me1" as="span">
                    {axis.poleLabels[poleIndex]}
                  </Typography>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
};

export default MbtiSelector;
