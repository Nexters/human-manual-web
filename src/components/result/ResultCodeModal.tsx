import Typography from "@/components/shared/Typography";
import CopyIcon from "@/components/shared/icons/CopyIcon";

type ResultCodeModalProps = {
  code: string;
};

export default function ResultCodeModal({ code }: ResultCodeModalProps) {
  return (
    <div className="flex flex-col items-center gap-[5px] text-center">
      <Typography variant="sb3" className="text-gray-06">
        코드를 사용해서 친구와의 케미를 확인해보세요
      </Typography>

      <div className="bg-gray-01 mt-[26px] flex h-[41px] items-center gap-2 rounded-[10px] px-5">
        <Typography variant="sb4" className="text-gray-06">
          내코드
        </Typography>
        <Typography variant="sb3" className="text-gray-08">
          {code}
        </Typography>
        <CopyIcon className="size-5 text-gray-05" />
      </div>
    </div>
  );
}
