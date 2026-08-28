import Typography from "@/components/shared/Typography";
import ChevronLeftIcon from "@/components/shared/icons/ChevronLeftIcon";
import { cn } from "@/lib/cn";

type DetailAccordionItemProps = {
  icon: string;
  /** 헤더에 그대로 쓰는 질문형 제목. */
  question: string;
  /** 펼쳤을 때 나오는 본문. 서버 detail.description 을 그대로 쓴다. */
  description: string;
  isOpen: boolean;
  onToggle: () => void;
};

// ------- 우리 사이 더 자세히 보기, 아코디언 한 칸 ------
// 예전엔 그리드 칸을 눌러 모달로 같은 내용을 크게 띄웠다. 모달과 칸이 같은 내용이라
// 자리만 옮기는 셈이었어서, 그 자리에서 펼치는 아코디언으로 바꿨다.
export default function DetailAccordionItem({
  icon,
  question,
  description,
  isOpen,
  onToggle,
}: DetailAccordionItemProps) {
  return (
    <div className="rounded-[10px] bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex h-[52px] w-full items-center gap-3 px-4"
      >
        <img src={icon} alt="" className="size-[40px] shrink-0 object-contain" />
        <Typography variant="sb4" as="span" className="text-gray-09 flex-1 text-left">
          {question}
        </Typography>
        {/* ChevronLeftIcon 은 위 방향 캐럿(-rotate-90 내장)이라, 아래로 돌려 접힘 표시를 만든다.
            Figma 캐럿은 10x5(2:1). viewBox 12x7 이므로 너비만 10px 로 두고 높이는 비율로 맡긴다. */}
        <ChevronLeftIcon
          className={cn(
            "text-gray-04 h-auto w-[10px] shrink-0 transition-transform",
            isOpen ? "rotate-0" : "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <Typography variant="me3" className="text-gray-07 break-keep">
            {description}
          </Typography>
        </div>
      )}
    </div>
  );
}
