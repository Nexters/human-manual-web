import { useEffect, useRef } from "react";
import Typography from "@/components/shared/Typography";

const LOADER_SCRIPT_SRC = "https://ads-partners.coupang.com/g.js";
const AD_CONFIG =
  '{"id":1020614,"template":"carousel","trackingCode":"AF6485415","width":"350","height":"70","tsource":""}';

/**
 * 쿠팡 파트너스 캐러셀 배너.
 * 위젯이 자기 자신을 삽입한 script 태그 위치를 기준으로 렌더링하기 때문에,
 * JSX에 <script>를 그대로 못 쓰고(React가 실행 안 함) 로더·설정 스크립트를
 * 이 컨테이너 안에 직접 appendChild로 순서대로 붙여야 한다.
 */
export default function CoupangPartnersAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const loaderScript = document.createElement("script");
    loaderScript.src = LOADER_SCRIPT_SRC;
    loaderScript.onload = () => {
      const initScript = document.createElement("script");
      initScript.textContent = `new PartnersCoupang.G(${AD_CONFIG});`;
      container.appendChild(initScript);
    };
    container.appendChild(loaderScript);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div>
      <div ref={containerRef} />
      <Typography variant="me4" className="text-gray-05 text-center text-[10px]">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </Typography>
    </div>
  );
}
