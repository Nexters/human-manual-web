import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/hooks/useModal";

export type ToyResult = {
  code: string;
  nickname: string;
  name: string;
  noun: string;
  image: string;
  date?: string;
  isLegacy?: boolean;
};

export function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("ml-auto shrink-0 text-[24px] leading-none", className)}>
      ›
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-main mb-2.5 text-[12px] font-bold tracking-[0.6px]">{children}</p>;
}

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        "text-gray-09 mb-4 text-[29px] leading-[1.38] font-extrabold tracking-[-1.3px] break-keep",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function Desc({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-gray-06 text-[14px] leading-[1.8] break-keep", className)}>{children}</p>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="text-gray-06 mx-1 my-6 text-center text-[12px] leading-[1.6] break-keep">
      {children}
    </p>
  );
}

type PillButtonProps = {
  tone?: "main" | "line";
  small?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function PillButton({
  tone = "main",
  small,
  className,
  children,
  ...props
}: PillButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full px-[22px] font-bold transition-[filter] hover:brightness-[0.97] active:translate-y-px",
        small ? "min-h-11 text-[13px]" : "min-h-[52px] text-[14px]",
        "disabled:bg-gray-03 disabled:border-gray-03 disabled:cursor-default disabled:text-white disabled:hover:brightness-100",
        tone === "main" ? "bg-main text-white" : "border-main text-main border bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextLink({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "text-gray-06 mx-auto my-[18px] block cursor-pointer text-[12px] underline underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

export function AccountStatus({ left, right }: { left: string; right: string }) {
  return (
    <div className="text-gray-06 mb-7 flex items-center justify-between rounded-[11px] bg-[#f0f2ff] px-[13px] py-2.5 text-[11px]">
      <span className="text-main font-bold">{left}</span>
      <span>{right}</span>
    </div>
  );
}

export function ArchiveTabs({
  active,
  onSelect,
}: {
  active: "results" | "compatibilities";
  onSelect: (tab: "results" | "compatibilities") => void;
}) {
  return (
    <div role="tablist" className="border-gray-02 my-[26px] flex border-b">
      {(
        [
          ["results", "내 결과"],
          ["compatibilities", "내 케미"],
        ] as const
      ).map(([tab, label]) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          onClick={() => onSelect(tab)}
          className={cn(
            "-mb-px flex-1 cursor-pointer p-[13px] text-[15px] font-semibold",
            active === tab ? "text-main border-main border-b-2" : "text-gray-06",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** 결과 카드. 대표 결과는 크게, 다른 결과는 compact 로 보여준다. */
export function ArchiveCard({
  result,
  compact,
  onClick,
  actions,
}: {
  result: ToyResult;
  compact?: boolean;
  onClick: () => void;
  actions?: ReactNode;
}) {
  const detail = useAssessmentResult(result.code);
  const navigate = useNavigate();
  const { open, close } = useModal();
  const showLegacyNotice = () =>
    open({
      title: "초기부터 패킷과 함께해주셨군요!",
      contents: (
        <div className="text-center">
          <Desc>
            패킷 업데이트로 옛날 결과는 기본 결과만 확인할 수 있고, 프리미엄 분석 등 일부 기능은
            이용하기 어려워요.
          </Desc>
          <Desc className="mt-3">모든 기능을 이용하려면 새 테스트를 한 번 진행해주세요.</Desc>
        </div>
      ),
      confirmLabel: "새 테스트 시작하기",
      onConfirm: () => {
        close();
        navigate("/?start=1");
      },
    });
  return (
    <article
      aria-label={`${result.noun} ${result.nickname}`}
      className={cn(
        "border-gray-02 overflow-hidden rounded-[24px] border bg-white",
        compact && "mt-3.5",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full cursor-pointer items-center gap-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-main",
          compact ? "px-4 py-4" : "px-[18px] py-6",
        )}
      >
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-full bg-[#f4f4f8]",
            compact ? "h-[65px] w-[60px]" : "h-[88px] w-[82px]",
          )}
        >
          <img
            src={result.image}
            alt={result.noun}
            className={cn("object-contain", compact ? "h-[60px] w-[54px]" : "h-[84px] w-[74px]")}
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          {detail.data?.overview.adjective && (
            <span className="text-gray-06 text-[12px] leading-[1.6] break-keep [overflow-wrap:anywhere]">
              {detail.data.overview.adjective}
            </span>
          )}
          <strong
            className={cn(
              "text-gray-09 leading-[1.4] font-bold tracking-[-0.5px] break-keep [overflow-wrap:anywhere]",
              compact ? "text-[16px]" : "text-[18px]",
            )}
          >
            {[result.noun, result.nickname].filter(Boolean).join(" ")}
          </strong>
          {result.date && (
            <span className="text-gray-05 mt-1 text-[11px] leading-[1.8]">{result.date}</span>
          )}
        </span>
        <Arrow className="text-gray-06 shrink-0 text-[27px]" />
      </button>
      {(result.isLegacy === true || actions) && (
        <div className="flex flex-wrap items-center justify-end gap-2 px-4 pb-3">
          {result.isLegacy === true && (
            <button
              type="button"
              onClick={showLegacyNotice}
              aria-label={`${result.noun} ${result.nickname} 옛날 결과 안내`}
              aria-haspopup="dialog"
              className="mr-auto flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full bg-amber-50 px-3 text-[12px] font-medium text-amber-800 focus-visible:outline-2 focus-visible:outline-amber-700"
            >
              <span aria-hidden="true">ⓘ</span>
              옛날 결과
            </button>
          )}
          {actions}
        </div>
      )}
    </article>
  );
}

export function History({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className="group border-gray-02 mt-5 mb-6 border-t py-[19px]">
      <summary className="text-gray-06 flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
        {summary}
      </summary>
      {children}
    </details>
  );
}

export function EmptyState({
  image,
  title,
  children,
}: {
  image: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-[30px] text-center">
      <img src={image} alt="" className="h-40 w-[150px] object-contain" />
      {title && <h3 className="text-gray-09 mt-4 text-[20px] font-bold">{title}</h3>}
      <p className="text-gray-06 mt-3 mb-7 text-[14px] leading-[1.6] break-keep">{children}</p>
    </div>
  );
}
