import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";

const BUTTON_STYLE =
  "bg-gray-09/55 flex size-9 items-center justify-center rounded-full text-white backdrop-blur-sm transition-opacity hover:opacity-90 active:opacity-80";

// 결과지가 길어서 상·하단을 오갈 수 있게 둔다. 하단 고정 CTA 위에 자리하도록 bottom 을 띄웠다.
// 아이콘은 왼쪽 셰브론을 돌려 쓴다(90deg 가 위, -90deg 가 아래).
// Tailwind 의 rotate-* 는 CSS rotate 속성이라 이 svg 에 적용되지 않아 transform 으로 준다.
export default function ScrollButtons() {
  const scrollTo = (top: number) => window.scrollTo({ top, behavior: "smooth" });

  return (
    <div className="fixed right-5 bottom-[92px] z-30 flex flex-col gap-[6px]">
      <button
        type="button"
        aria-label="맨 위로"
        onClick={() => scrollTo(0)}
        className={BUTTON_STYLE}
      >
        <ChevronLeftIcon className="size-5" style={{ transform: "rotate(90deg)" }} />
      </button>
      <button
        type="button"
        aria-label="맨 아래로"
        onClick={() => scrollTo(document.documentElement.scrollHeight)}
        className={BUTTON_STYLE}
      >
        <ChevronLeftIcon className="size-5" style={{ transform: "rotate(-90deg)" }} />
      </button>
    </div>
  );
}
