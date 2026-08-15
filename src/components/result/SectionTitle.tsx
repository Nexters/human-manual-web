import Typography from "@/components/shared/Typography";

type SectionTitleProps = {
  title: string;
  subtitle: string;
};

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="flex flex-col justify-center">
      <p
        className="text-center text-[30px] leading-[1] font-normal tracking-[-0.02em] uppercase break-keep"
        style={{ fontFamily: "'ThePosterFont', var(--font-sans)" }}
      >
        {title}
      </p>
      <Typography variant="sb3" className="text-center text-gray-06 mt-[10px] break-keep">
        {subtitle}
      </Typography>
    </div>
  );
}
