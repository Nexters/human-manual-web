import Typography from "@/components/shared/Typography";

type DetailAnalysisCardProps = {
  icon: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  description: string;
  /** 있으면 카드가 눌리는 요소가 된다. 눌러서 같은 내용을 크게 띄우는 용도다. */
  onClick?: () => void;
};

export default function DetailAnalysisCard({
  icon,
  titleBefore,
  titleHighlight,
  titleAfter,
  description,
  onClick,
}: DetailAnalysisCardProps) {
  const body = (
    <>
      <img src={icon} alt="" className="size-[60px] object-contain" />
      <Typography variant="sb4" className="text-gray-09 font-bold break-keep">
        {titleBefore}
        <span className="text-main">{titleHighlight}</span>
        {titleAfter}
      </Typography>
      <Typography variant="me3" className="text-gray-07 break-keep">
        {description}
      </Typography>
    </>
  );

  if (!onClick) {
    return <div className="flex flex-col gap-2 rounded-[10px] bg-white p-5">{body}</div>;
  }

  // 기본 모양은 위 div 와 같다. button 이 글자를 가운데로 밀어서 text-left 를 더했다.
  // 눌리는 카드임을 알리는 건 호버 링 하나뿐이다 — ring 은 box-shadow 라 레이아웃을
  // 밀지 않는다. 모바일에는 호버가 없으니 active 에도 같이 준다.
  return (
    <button
      type="button"
      onClick={onClick}
      className="ring-point flex flex-col gap-2 rounded-[10px] bg-white p-5 text-left transition-shadow hover:ring-2 active:ring-2"
    >
      {body}
    </button>
  );
}
