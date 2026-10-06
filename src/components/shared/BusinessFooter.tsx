import { Link } from "react-router-dom";

const businessInformation = [
  ["상호명", "언더스탠드라인"],
  ["대표자", "이해선"],
  ["사업자등록번호", "545-62-00933"],
  ["전화번호", "010-5310-3084"],
] as const;

export default function BusinessFooter() {
  return (
    <footer className="border-t border-gray-02 bg-gray-00 px-5 py-8 text-gray-06">
      <dl className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] leading-[1.6] tracking-[-0.22px]">
        {businessInformation.map(([label, value]) => (
          <div key={label} className="flex gap-1">
            <dt className="font-medium">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div className="flex w-full gap-1">
          <dt className="shrink-0 font-medium">사업장 주소</dt>
          <dd>서울특별시 영등포구 선유로11길 12, 101동 201호 (문래동6가, 문래파라곤)</dd>
        </div>
      </dl>
      <nav
        aria-label="서비스 정책"
        className="border-gray-02 mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-[11px] leading-[1.6] font-medium tracking-[-0.22px]"
      >
        <Link to="/terms" className="underline underline-offset-2">
          이용약관
        </Link>
        <Link to="/privacy" className="underline underline-offset-2">
          개인정보처리방침
        </Link>
        <Link to="/refund-policy" className="underline underline-offset-2">
          취소·환불 정책
        </Link>
      </nav>
    </footer>
  );
}
