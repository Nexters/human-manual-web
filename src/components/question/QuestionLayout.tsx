import { useEffect, useRef, type ReactNode } from "react";
import DevFillAnswersButton from "@/components/question/DevFillAnswersButton";
import ProgressBar from "@/components/question/ProgressBar";
import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import Typography from "@/components/shared/Typography";
import { TOTAL_STEPS } from "@/constants/questions";
import { cn } from "@/lib/cn";

type QuestionLayoutProps = {
  order: number;
  title: string;
  hint?: string;
  background?: "gray" | "white";
  titleAlign?: "left" | "center";
  onSeek?: (order: number) => void;
  maxOrder?: number;
  onBack: () => void;
  onReset: () => void;
  children: ReactNode;
  footer: ReactNode;
};

const QuestionLayout = ({
  order,
  title,
  hint,
  background = "gray",
  titleAlign = "left",
  onSeek,
  maxOrder,
  onBack,
  onReset,
  children,
  footer,
}: QuestionLayoutProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // 문항이 바뀔 때마다 선택지 영역에 포커스를 옮겨둔다.
  // 그래야 첫 Tab 이 뒤로가기·다시하기·진행바를 건너뛰고 선택지로 바로 들어간다.
  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
  }, [order]);

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col px-5 pb-[37px]",
        background === "white" ? "bg-white" : "bg-gray-00",
      )}
    >
      <div className="relative flex h-[60px] shrink-0 items-center">
        <button
          type="button"
          onClick={onBack}
          aria-label="이전 문항으로"
          className="text-gray-09 flex size-[30px] items-center justify-center"
        >
          <ChevronLeftIcon className="w-[10px]" />
        </button>

        <div className="ml-auto flex items-center gap-[10px]">
          {import.meta.env.DEV && (
            <>
              <DevFillAnswersButton />
              <Typography variant="me3" as="span" className="text-gray-03" aria-hidden>
                |
              </Typography>
            </>
          )}
          <button type="button" onClick={onReset} className="text-gray-06">
            <Typography variant="me3" as="span">
              검사 다시하기
            </Typography>
          </button>
        </div>
      </div>

      <div className="mt-[13px]">
        <ProgressBar current={order} total={TOTAL_STEPS} onSeek={onSeek} maxOrder={maxOrder} />
      </div>

      <Typography
        variant="h1"
        className={cn(
          "mt-[6px] whitespace-pre-line text-black",
          titleAlign === "center" ? "w-full text-center" : "max-w-[322px]",
        )}
      >
        {title}
      </Typography>

      {hint && (
        <Typography variant="sb4" className="text-gray-06 mt-[6px]">
          {hint}
        </Typography>
      )}

      <div
        ref={contentRef}
        tabIndex={-1}
        className="flex flex-1 flex-col justify-center py-8 outline-none"
      >
        {children}
      </div>

      <div className="mt-auto">{footer}</div>
    </div>
  );
};

export default QuestionLayout;
