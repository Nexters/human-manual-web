import type { ButtonHTMLAttributes, ReactNode } from "react";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";

type IconLabelCardProps = {
  icon: ReactNode;
  label: ReactNode;
  selected?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export default function IconLabelCard({
  icon,
  label,
  selected,
  className,
  ...props
}: IconLabelCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border p-4",
        selected ? "border-point bg-point/10" : "border-gray-02 bg-white",
        className,
      )}
      {...props}
    >
      <span className="flex size-9 items-center justify-center">{icon}</span>
      <Typography variant="sb4" as="span" className="text-gray-08">
        {label}
      </Typography>
    </button>
  );
}
