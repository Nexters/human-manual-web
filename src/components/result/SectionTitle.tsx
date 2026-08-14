import Typography from "@/components/shared/Typography";

type SectionTitleProps = {
  title: string;
  subtitle: string;
};

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <>
      <p
        className="text-center text-[24px] leading-[1] font-normal tracking-[-0.02em] text-gray-09 uppercase"
        style={{ fontFamily: "'ThePosterFont', var(--font-sans)" }}
      >
        {title}
      </p>
      <Typography variant="me2" className="text-center text-gray-07">
        {subtitle}
      </Typography>
    </>
  );
}
