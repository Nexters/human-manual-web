import { initialModalState, useModalStore } from "@/stores/modalStore";
import type { ModalType } from "@/types/modal";

export const useModal = () => {
  const modal = useModalStore((state) => state.modal);
  const setModal = useModalStore((state) => state.setModal);

  const open = ({ title, contents, confirmLabel, onConfirm, onClose }: Omit<ModalType, "isOpen">) => {
    setModal({
      isOpen: true,
      title,
      contents,
      confirmLabel,
      onConfirm,
      onClose,
    });
  };

  const close = () => {
    modal.onClose?.();
    setModal({ ...initialModalState });
  };

  return {
    open,
    close,
    modal,
  };
};
