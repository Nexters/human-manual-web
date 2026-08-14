import Typography from "@/components/shared/Typography";

type TraitSliderProps = {
  label1: string;
  label2: string;
  value: number;
};

export default function TraitSlider({ label1, label2, value }: TraitSliderProps) {
  const percentage = (value / 100) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="sb4" as="span" className="text-point text-sm">
          {label1}
        </Typography>
        <Typography variant="sb4" as="span" className="text-point text-sm">
          {label2}
        </Typography>
      </div>

      {/* Slider Bar */}
      <div className="relative h-2 w-full rounded-full bg-gray-02 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-point to-sub-4 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Center indicator */}
      <div className="flex justify-center">
        <div className="w-1 h-1 bg-gray-05 rounded-full" />
      </div>
    </div>
  );
}
