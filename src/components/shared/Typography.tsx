import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const typographyVariants = {
  h1: "text-[24px] leading-[1.5] tracking-[-0.96px] font-bold",
  h2: "text-[20px] leading-[1.5] tracking-[-0.8px] font-bold",
  h3: "text-[18px] leading-[1.5] tracking-[-0.72px] font-bold",
  sb1: "text-[24px] leading-[1.5] tracking-[-0.96px] font-semibold",
  sb2: "text-[20px] leading-[1.5] tracking-[-0.8px] font-semibold",
  sb3: "text-[18px] leading-[1.5] tracking-[-0.72px] font-semibold",
  sb4: "text-[16px] leading-[1.5] tracking-[-0.64px] font-semibold",
  me1: "text-[18px] leading-[1.5] tracking-[-0.72px] font-medium",
  me2: "text-[16px] leading-[1.5] tracking-[-0.64px] font-medium",
  me3: "text-[14px] leading-[1.5] tracking-[-0.56px] font-medium",
  me4: "text-[12px] leading-[1] tracking-[-0.48px] font-medium",
} as const;

type TypographyVariant = keyof typeof typographyVariants;

const defaultElement: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  sb1: "p",
  sb2: "p",
  sb3: "p",
  sb4: "p",
  me1: "p",
  me2: "p",
  me3: "p",
  me4: "p",
};

type TypographyProps<T extends ElementType> = {
  variant: TypographyVariant;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "variant">;

export default function Typography<T extends ElementType = "p">({
  variant,
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? defaultElement[variant];

  return <Component className={cn(typographyVariants[variant], className)} {...props} />;
}
