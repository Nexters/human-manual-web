import { useCallback } from "react";
import { initialModalState, useModalStore } from "@/stores/modalStore";
import type { ModalType } from "@/types/modal";

export const useModal = () => {
  const modal = useModalStore((state) => state.modal);
  const setModal = useModalStore((state) => state.setModal);

  const open = useCallback(
    ({ title, contents, confirmLabel, onConfirm, onClose }: Omit<ModalType, "isOpen">) => {
      setModal({
        isOpen: true,
        title,
        contents,
        confirmLabel,
        onConfirm,
        onClose,
      });
    },
    [setModal],
  );

  const close = useCallback(() => {
    modal.onClose?.();
    setModal({ ...initialModalState });
  }, [modal, setModal]);

  return {
    open,
    close,
    modal,
  };
};
