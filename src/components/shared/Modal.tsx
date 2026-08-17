import { createPortal } from "react-dom";
import { useEffect } from "react";
import Typography from "@/components/shared/Typography";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/cn";

/**
 * 앱 최상단에 단 한 번 마운트되는 모달 루트.
 * useModal().open()으로 store 상태를 채우면 이 컴포넌트가 그 내용을 그린다.
 */
export default function Modal() {
  const { modal, close } = useModal();
  const { isOpen, title, contents, confirmLabel, onConfirm } = modal;

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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      {/* ----- 배경 딤 ----- */}
      <button
        type="button"
        aria-label="닫기"
        onClick={close}
        className="absolute inset-0 bg-black/50"
      />

      {/* ----- 모달 카드 ----- */}
      <div className="relative flex w-full max-w-[400px] flex-col items-center rounded-[20px] bg-white px-[21px] pt-[23px] pb-[23px]">
        {title && (
          <Typography variant="h1" className="text-gray-09 text-center">
            {title}
          </Typography>
        )}

        {contents && (
          <div className={cn("flex w-full flex-col items-center", title && "mt-7")}>
            {contents}
          </div>
        )}

        {confirmLabel && (
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "flex h-[54px] w-full items-center justify-center rounded-[10px] bg-sub-4 text-white transition-opacity hover:opacity-90 active:opacity-80",
              contents ? "mt-[33px]" : "mt-7",
            )}
          >
            <Typography variant="h2" as="span">
              {confirmLabel}
            </Typography>
          </button>
        )}
      </div>
    </div>,
    modalRoot,
  );
}
