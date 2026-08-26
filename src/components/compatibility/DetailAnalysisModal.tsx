import Typography from "@/components/shared/Typography";

type DetailAnalysisModalProps = {
  icon: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  description: string;
};

// ------- 상세 분석 카드 팝업 ------
// 그리드 칸에서는 설명이 잘리므로, 같은 내용을 자르지 않고 크게 보여주는 자리다.
// 아이콘을 카드보다 키워 어느 카드를 열었는지 한눈에 알 수 있게 한다.
export default function DetailAnalysisModal({
  icon,
  titleBefore,
  titleHighlight,
  titleAfter,
  description,
}: DetailAnalysisModalProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 pt-1">
      <img src={icon} alt="" className="size-[96px] object-contain" />

      <Typography variant="h2" className="text-gray-09 text-center break-keep">
        {titleBefore}
        <span className="text-main">{titleHighlight}</span>
        {titleAfter}
      </Typography>

      <Typography variant="me2" className="text-gray-07 text-center break-keep">
        {description}
      </Typography>
    </div>
  );
}
