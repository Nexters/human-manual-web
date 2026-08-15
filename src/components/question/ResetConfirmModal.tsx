import QuestionCtaButton from "@/components/question/QuestionCtaButton";
import Typography from "@/components/shared/Typography";
import WarningIcon from "@/components/shared/icons/WarningIcon";

type ResetConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ResetConfirmModal = ({ open, onCancel, onConfirm }: ResetConfirmModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-[30px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[330px] rounded-2xl bg-white px-[18px] pt-[33px] pb-[21px] text-center">
        <WarningIcon className="text-gray-02 mx-auto size-[40px]" />

        <Typography variant="h2" className="mt-[14px] text-black">
          검사를 처음부터 다시 하시겠습니까?
        </Typography>
        <Typography variant="me2" className="text-gray-07 mt-[4px]">
          선택한 내용들은 모두 초기화됩니다.
        </Typography>

        <div className="mt-[28px] flex gap-[14px]">
          <QuestionCtaButton tone="gray" className="h-[46px] flex-1" onClick={onCancel}>
            취소
          </QuestionCtaButton>
          <QuestionCtaButton className="h-[46px] flex-1" onClick={onConfirm}>
            검사 다시하기
          </QuestionCtaButton>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
