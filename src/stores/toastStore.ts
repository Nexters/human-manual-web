import { create } from "zustand";
import type { ToastType } from "@/types/toast";

const initialState: ToastType = {
  isOpen: false,
  message: undefined,
};

type ToastStore = {
  toast: ToastType;
  setToast: (toast: ToastType) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toast: initialState,
  setToast: (toast) => set({ toast }),
}));

export { initialState as initialToastState };
