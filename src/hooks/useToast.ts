import { useCallback } from "react";
import type { ReactNode } from "react";
import { initialToastState, useToastStore } from "@/stores/toastStore";

const TOAST_DURATION = 2000;

export const useToast = () => {
  const toast = useToastStore((state) => state.toast);
  const setToast = useToastStore((state) => state.setToast);

  const close = useCallback(() => {
    setToast({ ...initialToastState });
  }, [setToast]);

  const open = useCallback(
    (message: ReactNode) => {
      setToast({ isOpen: true, message });
      setTimeout(close, TOAST_DURATION);
    },
    [setToast, close],
  );

  return {
    open,
    close,
    toast,
  };
};
