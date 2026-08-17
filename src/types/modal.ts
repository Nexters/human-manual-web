import type { ReactNode } from "react";

export type ModalType = {
  isOpen: boolean;
  title?: ReactNode;
  contents?: ReactNode;
  confirmLabel?: ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
};
