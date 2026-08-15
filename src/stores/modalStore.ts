import { create } from "zustand";
import type { ModalType } from "@/types/modal";

const initialState: ModalType = {
  isOpen: false,
  title: undefined,
  description: undefined,
  contents: undefined,
  leftButton: undefined,
  rightButton: undefined,
  overrideActionElements: undefined,
  onConfirm: undefined,
  onClose: undefined,
  options: undefined,
};

type ModalStore = {
  modal: ModalType;
  setModal: (modal: ModalType) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: initialState,
  setModal: (modal) => set({ modal }),
}));

export { initialState as initialModalState };
