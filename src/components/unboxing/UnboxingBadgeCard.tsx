import Chip from "@/components/shared/Chip";
import Typography from "@/components/shared/Typography";

type UnboxingBadgeCardProps = {
  message: string;
  description?: string;
};

export default function UnboxingBadgeCard({ message, description }: UnboxingBadgeCardProps) {
  return (
    <div className="relative flex h-[111px] w-full max-w-[349px] flex-col items-center justify-center gap-1 rounded-[15px] bg-gray-00">
      <Chip
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[#FF85D1] text-white"
        style={{ fontFamily: "'ThePosterFont', var(--font-sans)" }}
      >
        UNBOXING
      </Chip>
      <Typography variant="h2" className="px-6 text-center text-black">
        {message}
      </Typography>
      {description && (
        <Typography variant="me2" className="text-gray-06 px-6 text-center">
          {description}
        </Typography>
      )}
    </div>
  );
}
