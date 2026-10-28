import { useEffect } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { authMockEnabled } from "@/lib/authMockMode";
import SiteHeader from "@/components/home/SiteHeader";
import { useAuth } from "@/hooks/useAuth";
import { trackPageView } from "@/lib/google-analytics";

// 내 보관함은 화면 안에 내 결과·내 궁합 탭이 있어 계정 탭 없이 로고와 메뉴만 둔다.
const ARCHIVE_PATHS = ["/my/results", "/my/compatibilities"];

export default function AppLayout() {
  useAuth();
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
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-white">
      {authMockEnabled && (
        <div className="bg-yellow-100 px-5 py-2 text-center text-xs text-gray-09" role="status">
          로컬 API 모킹 · 실제 카카오 인증 없이 테스트 중
        </div>
      )}
      <div className="sticky top-0 z-40">
        <SiteHeader
          account={
            location.pathname.startsWith("/my/") && !ARCHIVE_PATHS.includes(location.pathname)
          }
        />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
