import type { ReactNode } from "react";

export type ModalActionVariant = "solid" | "outline" | "point";

export type ModalActionButton = {
  label: ReactNode;
  onClick?: () => void;
  variant?: ModalActionVariant;
  disabled?: boolean;
};

export type ModalOptions = {
  /** 배경(딤) 클릭으로 닫기를 허용할지 여부. 기본값 true */
  closeOnDimClick?: boolean;
};

export type ModalType = {
  isOpen: boolean;
  title?: ReactNode;
  description?: ReactNode;
  contents?: ReactNode;
  leftButton?: ModalActionButton;
  rightButton?: ModalActionButton;
  /** leftButton/rightButton 대신 액션 영역을 완전히 커스텀하고 싶을 때 사용 */
  overrideActionElements?: ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
  options?: ModalOptions;
};
