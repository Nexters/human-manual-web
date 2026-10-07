import type { ReactNode } from "react";

export type ModalType = {
  isOpen: boolean;
  cardClassName?: string;
  ariaLabelledBy?: string;
  title?: ReactNode;
  contents?: ReactNode;
  confirmLabel?: ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
};
