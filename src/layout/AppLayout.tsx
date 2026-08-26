import { useEffect } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { trackPageView } from "@/lib/google-analytics";

export default function AppLayout() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // 새 화면으로 갈 때는 맨 위에서 시작한다. 케미 페이지의 "케미 보기" 처럼 화면 아래쪽
  // 버튼으로 이동하면 스크롤 위치가 그대로 남아, 새 결과지의 중간부터 보이게 된다.
  // 뒤로가기(POP)는 브라우저가 읽던 위치로 되돌리므로 건드리지 않는다.
  useEffect(() => {
    if (navigationType === "POP") return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.search, navigationType]);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[440px] bg-white">
      <Outlet />
    </div>
  );
}
