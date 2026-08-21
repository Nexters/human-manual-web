import QuestionCtaButton from "@/components/question/QuestionCtaButton";
import Typography from "@/components/shared/Typography";
import CheckIcon from "@/components/shared/icons/CheckIcon";
import logo from "@/assets/img/logo.png";

type InvitePreviewStepProps = {
  friendNickname: string;
  friendNoun: string;
  friendImageUrl: string;
  onStart: () => void;
  onCheckExistingCode: () => void;
};

export default function InvitePreviewStep({
  friendNickname,
  friendNoun,
  friendImageUrl,
  onStart,
  onCheckExistingCode,
}: InvitePreviewStepProps) {
  const previewItems = [
    "나를 닮은 장난감과 내 사용설명서",
    `${friendNickname}님과의 케미 점수`,
    "둘 사이 거리감과 대화 방식 설명서",
  ];

  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col items-center px-5 pt-[54px] pb-10">
      <img src={logo} alt="Pakit" className="h-8 w-auto" />

      <Typography variant="h2" className="text-gray-08 mt-10 text-center">
        {friendNickname}님이 케미 테스트를 보냈어요
      </Typography>

      <div className="mt-10 flex items-center gap-4">
        <div className="flex flex-col items-center gap-3">
          <img
            src={friendImageUrl}
            alt={`${friendNoun} 캐릭터`}
            className="size-[134px] rounded-full bg-white object-contain p-3 shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
          />
          <div className="flex flex-col items-center">
            <Typography variant="h2" className="text-gray-07">
              {friendNickname}님
            </Typography>
            <Typography variant="sb4" className="text-gray-05">
              {friendNoun}
            </Typography>
          </div>
        </div>

        <Typography variant="h2" className="text-gray-03">
          ×
        </Typography>

        <div className="flex flex-col items-center gap-3">
          <div className="flex size-[134px] items-center justify-center rounded-full bg-gray-02">
            <Typography variant="h1" className="text-gray-04">
              ?
            </Typography>
          </div>
          <div className="flex flex-col items-center">
            <Typography variant="h2" className="text-gray-07">
              나
            </Typography>
            <Typography variant="sb4" className="text-gray-05">
              ??
            </Typography>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <Typography variant="sb3" className="text-gray-08">
          둘의 케미 점수
        </Typography>
        <div className="text-sub-4 flex items-baseline font-bold">
          <span className="text-[40px] tracking-[-1.6px]">??</span>
          <span className="text-[20px] tracking-[-0.8px]">%</span>
        </div>
      </div>

      <div className="bg-gray-03 mt-10 h-px w-11" />

      <div className="mt-10 flex w-full flex-col items-center gap-4">
        <Typography variant="sb2" className="text-gray-09">
          테스트하면 이런 결과가 나와요
        </Typography>
        <div className="flex w-full flex-col gap-3 rounded-[10px] bg-white px-6 py-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
          {previewItems.map((text) => (
            <div key={text} className="flex items-center gap-2">
              <CheckIcon className="size-[15px] shrink-0 text-green-500" />
              <Typography variant="sb4" className="text-gray-08">
                {text}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex w-full flex-col items-center gap-3 pt-10">
        <QuestionCtaButton tone="point" onClick={onStart}>
          내 장난감 만들고 케미 보기
        </QuestionCtaButton>
        <Typography variant="me2" className="text-gray-05">
          가입 없이 3분이면 충분해요
        </Typography>
        <button type="button" onClick={onCheckExistingCode} className="mt-2">
          <Typography variant="sb4" className="text-gray-06 underline">
            이미 테스트해서 코드가 있어요
          </Typography>
        </button>
      </div>
    </div>
  );
}
