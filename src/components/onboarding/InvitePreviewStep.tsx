import QuestionCtaButton from "@/components/question/QuestionCtaButton";
import Typography from "@/components/shared/Typography";
import CheckIcon from "@/components/shared/icons/CheckIcon";
import logo from "@/assets/img/logo.png";
import bearSilhouette from "@/assets/img/result/share/bear.png";
import questionMark from "@/assets/img/result/share/question.png";

type InvitePreviewStepProps = {
  friendNickname: string;
  friendNoun: string;
  friendImageUrl: string;
  onStart: () => void;
  onCheckExistingCode: () => void;
  onViewFriendResult: () => void;
};

export default function InvitePreviewStep({
  friendNickname,
  friendNoun,
  friendImageUrl,
  onStart,
  onCheckExistingCode,
  onViewFriendResult,
}: InvitePreviewStepProps) {
  const previewItems = [
    "나를 닮은 장난감과 내 사용설명서",
    `${friendNickname}님과의 케미 지수`,
    "둘 사이 거리감과 대화 방식 설명서",
  ];

  return (
    <div className="bg-gray-00 flex min-h-dvh flex-col items-center px-5 pt-[54px] pb-10">
      <img src={logo} alt="Pakit" className="h-8 w-auto" />

      <Typography variant="h2" className="text-gray-08 mt-10 text-center break-keep">
        {friendNickname}님이 함께 케미를 보고 싶어 해요
      </Typography>

      <div className="mt-10 flex items-start gap-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-[134px] items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
            <img
              src={friendImageUrl}
              alt={`${friendNoun} 캐릭터`}
              className="size-[105px] object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Typography variant="h2" className="text-gray-07">
              {friendNickname}님
            </Typography>
            <Typography variant="sb4" className="text-gray-05">
              {friendNoun}
            </Typography>
          </div>
        </div>

        <div className="flex h-[134px] items-center justify-center">
          <Typography variant="h2" className="text-gray-03">
            ×
          </Typography>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="relative flex size-[134px] items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
            <img src={bearSilhouette} alt="" className="size-[112px] object-contain" />
            <img src={questionMark} alt="" className="absolute h-[26px] w-auto opacity-70" />
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

      <button
        type="button"
        onClick={onViewFriendResult}
        className="border-main-light text-main mt-12 flex h-[40px] w-[304px] items-center justify-center rounded-[50px] border-[1.5px] bg-white transition-opacity active:opacity-90"
      >
        <Typography variant="me2" as="span" className="tracking-[-0.8px]">
          {friendNickname}님 결과지 보기
        </Typography>
      </button>

      <div className="mt-6 flex flex-col items-center gap-2">
        <Typography variant="sb3" className="text-gray-08">
          둘의 케미 지수
        </Typography>
        <div className="text-sub-4 flex items-baseline font-bold">
          <span className="text-[40px] tracking-[-1.6px]">??</span>
          <span className="text-[20px] tracking-[-0.8px]">%</span>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col items-center">
        <Typography variant="sb2" className="text-gray-09">
          테스트하면 이런 결과가 나와요
        </Typography>
        <div className="mt-4 flex w-full flex-col gap-3 rounded-[10px] bg-white px-6 py-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
          {previewItems.map((text) => (
            <div key={text} className="flex items-center gap-2">
              <CheckIcon className="text-sub-4 size-6 shrink-0" />
              <Typography variant="sb4" as="span" className="text-gray-08 flex-1 text-center break-keep">
                {text}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex w-full flex-col items-center gap-3 pt-10">
        <QuestionCtaButton tone="point" onClick={onStart}>
          테스트하고 케미 보기
        </QuestionCtaButton>
        <button
          type="button"
          onClick={onCheckExistingCode}
          className="border-point flex h-[54px] w-full items-center justify-center rounded-[10px] border bg-white transition-opacity active:opacity-90"
        >
          <Typography variant="h2" as="span" className="text-sub-4">
            이미 테스트 했다면?
          </Typography>
        </button>
      </div>
    </div>
  );
}
