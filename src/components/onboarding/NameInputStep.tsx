import Button from "@/components/shared/Button";
import Typography from "@/components/shared/Typography";
import TextField from "@/components/shared/TextField";
import SpeechBubble from "@/components/onboarding/SpeechBubble";
import notebookBg from "@/assets/img/notebook-bg.jpg";

type NameInputStepProps = {
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
};

export default function NameInputStep({ name, onNameChange, onNext }: NameInputStepProps) {
  return (
    <div className="relative flex h-full min-h-dvh flex-col overflow-hidden">
      <img src={notebookBg} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative flex flex-1 flex-col px-5 pt-[95px] pb-10">
        <SpeechBubble
          message={
            <div className="flex flex-col items-center gap-1 text-center break-keep">
              <Typography variant="h3">배송 전에 이름부터 확인할게요!</Typography>
              <Typography variant="sb4" className="text-gray-07 font-normal">
                당신의 이름을 알려주세요
              </Typography>
            </div>
          }
        />
        <div className="flex-1" />
        <TextField
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="text-center"
        />
        <div className="flex-1" />
      </div>
      <div className="relative px-5 pb-10">
        <Button className="w-full" disabled={!name.trim()} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
