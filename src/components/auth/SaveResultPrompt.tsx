import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { useMyResultStore } from "@/stores/myResultStore";
import { useModalStore } from "@/stores/modalStore";
import { startKakaoLogin } from "@/lib/auth";

const dismissKey = (code: string) => `pakit-save-prompt-dismissed:${code}`;

/** 내 결과를 처음 열 때 한 번 안내하고, 나중에는 결과 상단에서 다시 열 수 있다. */
export default function SaveResultPrompt({ resultCode }: { resultCode: string }) {
  const auth = useAuth();
  const myCode = useMyResultStore((state) => state.resultCode);
  const { open, close } = useModal();
  const promptedCode = useRef<string | null>(null);
  const canSave = !auth.isPending && !auth.isError && !auth.data && myCode === resultCode;

  const rememberDismissal = useCallback(() => {
    try {
      sessionStorage.setItem(dismissKey(resultCode), "1");
    } catch {
      /* 저장소가 차단되어도 이번 화면에서 중복 안내하지 않는다. */
    }
  }, [resultCode]);

  const openSaveModal = useCallback(() => {
    open({
      cardClassName: "rounded-[28px] px-6 pt-9 pb-5 shadow-[0_24px_80px_rgba(24,28,47,0.14)]",
      onClose: rememberDismissal,
      contents: (
        <div className="flex w-full flex-col items-center text-center">
          <span className="mb-6 text-[38px] leading-none" aria-hidden="true">
            📥
          </span>
          <h2
            id="save-result-title"
            className="text-[20px] leading-[1.5] font-bold tracking-[-0.7px] text-[#252938]"
          >
            이 결과를 계정에 보관할까요?
          </h2>
          <p className="mt-4 text-[15px] leading-[1.8] tracking-[-0.4px] break-keep text-[#8a887f]">
            지금 카카오로 로그인해두면 휴대폰을 바꾸거나 브라우저 기록을 지워도 이 결과를 다시
            열어볼 수 있어요.
          </p>
          <p className="mt-6 w-full rounded-[18px] bg-[#f4f3ef] px-4 py-[18px] text-[14px] leading-[1.6] tracking-[-0.3px] break-keep text-[#8a887f]">
            이 결과는 현재 브라우저에 저장되어 있어요.
          </p>
          <button
            type="button"
            className="mt-6 flex min-h-[54px] w-full items-center justify-center rounded-[12px] bg-[#252a4b] px-3 text-[16px] font-semibold tracking-[-0.4px] text-white transition-colors hover:bg-[#33395f] active:bg-[#1c203b]"
            onClick={() => {
              rememberDismissal();
              startKakaoLogin();
            }}
          >
            카카오로 로그인하고 보관하기
          </button>
          <button
            type="button"
            className="mt-3 min-h-[48px] px-6 text-[15px] font-medium text-[#a09c90] transition-colors hover:text-[#666359]"
            onClick={close}
          >
            나중에 할게요
          </button>
        </div>
      ),
      ariaLabelledBy: "save-result-title",
    });
  }, [open, close, rememberDismissal]);

  useEffect(() => {
    if (!canSave || promptedCode.current === resultCode) return;
    try {
      if (sessionStorage.getItem(dismissKey(resultCode))) return;
    } catch {
      /* 이번 화면에서는 ref로 중복 안내를 막는다. */
    }
    // 결과의 첫 화면을 먼저 보여준 뒤 안내한다. 다른 모달을 덮어쓰지 않는다.
    const timer = window.setTimeout(() => {
      if (useModalStore.getState().modal.isOpen) return;
      promptedCode.current = resultCode;
      openSaveModal();
    }, 700);
    return () => window.clearTimeout(timer);
  }, [canSave, resultCode, openSaveModal]);

  if (auth.isPending || auth.isError || myCode !== resultCode) return null;
  return (
    <div className="bg-white px-5 py-4">
      {auth.data ? (
        <Link
          to="/my/results"
          className="flex min-h-[52px] items-center justify-between gap-3 rounded-[14px] bg-[#f5f4f1] px-4 text-[14px] font-medium text-[#57584f]"
        >
          <span>내 결과와 궁합 모아보기</span>
          <Chevron />
        </Link>
      ) : (
        <button
          type="button"
          onClick={openSaveModal}
          className="flex min-h-[60px] w-full items-center gap-3 rounded-[14px] bg-[#f5f4f1] px-4 text-left transition-colors hover:bg-[#eeede8]"
          aria-label="계정에 결과 보관하기"
        >
          <span aria-hidden="true" className="text-[24px]">
            📥
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-[#373a48]">
              내 장난감, 오래 보관해요
            </span>
            <span className="mt-0.5 block text-[12px] text-[#929084]">
              로그인하면 다른 기기에서도 꺼내볼 수 있어요
            </span>
          </span>
          <Chevron />
        </button>
      )}
    </div>
  );
}
function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-[#a5a294]"
    >
      <path
        d="m6 4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
