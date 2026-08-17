import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/hooks/useToast";

const EXIT_ANIMATION_DURATION = 200;

/**
 * 앱 최상단에 단 한 번 마운트되는 토스트 루트.
 * useToast().open()으로 store 상태를 채우면 이 컴포넌트가 그 내용을 그린다.
 * isOpen이 꺼진 뒤에도 퇴장 애니메이션이 끝날 때까지 마지막 메시지를 유지하며 렌더링한다.
 */
export default function Toast() {
  const { toast } = useToast();
  const { isOpen, message } = toast;
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [displayMessage, setDisplayMessage] = useState<ReactNode>(message);

  useEffect(() => {
    if (isOpen) {
      setDisplayMessage(message);
      setShouldRender(true);
      return;
    }

    const timer = setTimeout(() => setShouldRender(false), EXIT_ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [isOpen, message]);

  if (!shouldRender) return null;

  const toastRoot = document.getElementById("toast-root");
  if (!toastRoot) return null;

  return createPortal(
    <div className="fixed inset-x-0 bottom-[54px] z-[200] flex justify-center px-5">
      <div
        className={`w-full max-w-[400px] rounded-[10px] bg-gray-08 px-4 py-3 ${
          isOpen ? "animate-toast-in" : "animate-toast-out"
        }`}
      >
        <p className="text-[15px] leading-[22px] tracking-[-0.345px] text-white">
          {displayMessage}
        </p>
      </div>
    </div>,
    toastRoot,
  );
}
