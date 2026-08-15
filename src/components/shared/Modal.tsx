import { createPortal } from "react-dom";
import { useEffect } from "react";
import Typography from "@/components/shared/Typography";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/cn";
import type { ModalActionButton, ModalActionVariant } from "@/types/modal";

const buttonVariantClass: Record<ModalActionVariant, string> = {
  solid: "bg-main text-white",
  outline: "border border-main text-main bg-white",
  point: "bg-sub-4 text-white",
};

function ModalActionButtonElement({
  button,
  fullWidth,
}: {
  button: ModalActionButton;
  fullWidth: boolean;
}) {
  return (
    <button
      type="button"
      onClick={button.onClick}
      disabled={button.disabled}
      className={cn(
        "flex h-[54px] flex-1 items-center justify-center rounded-[10px] transition-opacity hover:opacity-90 active:opacity-80",
        "disabled:cursor-not-allowed disabled:opacity-40",
        buttonVariantClass[button.variant ?? "outline"],
        fullWidth && "w-full",
      )}
    >
      <Typography variant="h2" as="span">
        {button.label}
      </Typography>
    </button>
  );
}

/**
 * 앱 최상단에 단 한 번 마운트되는 모달 루트.
 * useModal().open()으로 store 상태를 채우면 이 컴포넌트가 그 내용을 그린다.
 */
export default function Modal() {
  const { modal, close } = useModal();
  const { isOpen, title, description, contents, leftButton, rightButton, overrideActionElements, options } =
    modal;

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const hasBothButtons = Boolean(leftButton) && Boolean(rightButton);
  const closeOnDimClick = options?.closeOnDimClick ?? true;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      {/* ----- 배경 딤 ----- */}
      <button
        type="button"
        aria-label="닫기"
        onClick={closeOnDimClick ? close : undefined}
        className="absolute inset-0 bg-black/50"
      />

      {/* ----- 모달 카드 ----- */}
      <div className="relative flex w-full max-w-[400px] flex-col items-center rounded-[20px] bg-white px-[21px] pt-[23px] pb-[23px]">
        {(title || description) && (
          <div className="flex flex-col items-center gap-[5px] text-center">
            {title && (
              <Typography variant="h1" className="text-gray-09">
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="sb3" className="text-gray-06">
                {description}
              </Typography>
            )}
          </div>
        )}

        {contents && <div className="mt-7 flex w-full flex-col items-center">{contents}</div>}

        {overrideActionElements ??
          ((leftButton || rightButton) && (
            <div className={cn("flex w-full gap-2", contents ? "mt-[33px]" : "mt-7")}>
              {leftButton && <ModalActionButtonElement button={leftButton} fullWidth={!hasBothButtons} />}
              {rightButton && <ModalActionButtonElement button={rightButton} fullWidth={!hasBothButtons} />}
            </div>
          ))}
      </div>
    </div>,
    modalRoot,
  );
}
