import Typography from "@/components/shared/Typography";

type SectionTitleProps = {
  title: string;
  subtitle: string;
};

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <Typography variant="h1" className="text-center text-gray-09 break-keep">
        {title}
      </Typography>
      <Typography variant="sb3" className="text-center text-gray-06 break-keep">
        {subtitle}
      </Typography>
    </div>
  );
}
