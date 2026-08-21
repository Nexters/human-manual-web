import AssetImage from "@/components/shared/AssetImage";
import { questionAsset } from "@/constants/assets";

type ActionQuestionProps = {
  questionId: string;
  bubble: string;
  pressed: boolean;
  onPress: () => void;
};

const ActionQuestion = ({ questionId, bubble, pressed, onPress }: ActionQuestionProps) => {
  if (pressed) {
    return (
      <div key="pressed" className="flex flex-1 items-center justify-center">
        <AssetImage src={questionAsset(questionId, "pressed")} className="size-[300px]" />
      </div>
    );
  }

  return (
    <div key="unpressed" className="flex flex-1 flex-col items-center justify-center">
      <AssetImage
        src={questionAsset(questionId, "bubble")}
        alt={bubble}
        className="h-[53px] w-[165px] motion-safe:animate-float"
      />
      <button
        type="button"
        onClick={onPress}
        aria-label="버튼 누르기"
        className="-mt-[4px] transition-transform active:scale-95"
      >
        <AssetImage src={questionAsset(questionId, "press")} className="size-[250px]" />
      </button>
    </div>
  );
};

export default ActionQuestion;
