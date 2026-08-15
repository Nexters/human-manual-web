import { initialModalState, useModalStore } from "@/stores/modalStore";
import type { ModalType } from "@/types/modal";

export const useModal = () => {
  const modal = useModalStore((state) => state.modal);
  const setModal = useModalStore((state) => state.setModal);

  const open = ({
    contents,
    title,
    description,
    onConfirm,
    onClose,
    leftButton,
    rightButton,
    overrideActionElements,
    options,
  }: Omit<ModalType, "isOpen">) => {
    setModal({
      isOpen: true,
      title,
      description,
      contents,
      onConfirm,
      onClose,
      leftButton,
      rightButton,
      overrideActionElements,
      options: {
        ...(modal.options || {}),
        ...options,
      },
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
