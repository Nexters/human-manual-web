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

  // modal 을 클로저로 잡으면 open 으로 modal 이 교체될 때마다 close 의 참조가 바뀐다.
  // close 를 deps 로 쓰는 이펙트가 무한 재실행되므로, 호출 시점에 스토어에서 직접 읽는다.
  const close = useCallback(() => {
    useModalStore.getState().modal.onClose?.();
    setModal({ ...initialModalState });
  }, [setModal]);

  return {
    open,
    close,
    modal,
  };
};
