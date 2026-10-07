import { useState } from "react";
import { Link } from "react-router-dom";
import Typography from "@/components/shared/Typography";
import {
  ANALYTICS_CONSENT_KEY,
  initializeGoogleAnalytics,
  trackPageView,
} from "@/lib/google-analytics";

interface AnalyticsConsentProps {
  currentPath: string;
}

export default function AnalyticsConsent({ currentPath }: AnalyticsConsentProps) {
  const [isVisible, setIsVisible] = useState(
    () => window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === null,
  );

  if (!isVisible) return null;

  const saveConsent = (value: "granted" | "denied") => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
    setIsVisible(false);

    if (value === "granted") {
      initializeGoogleAnalytics();
      trackPageView(currentPath);
    }
  };

  return (
    <aside
      aria-label="분석 쿠키 선택"
      className="fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-[440px] border-t border-gray-02 bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(16,24,40,0.08)]"
    >
      <Typography variant="sb4" className="text-gray-09">
        선택적 분석 쿠키 안내
      </Typography>
      <Typography variant="me4" className="mt-1 leading-[1.55] text-gray-06 break-keep">
        서비스 개선을 위해 Google Analytics를 사용할 수 있어요. 동의하지 않아도 모든 기능을 이용할
        수 있습니다.{" "}
        <Link to="/privacy" className="underline underline-offset-2">
          자세히 보기
        </Link>
      </Typography>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => saveConsent("denied")}
          className="h-11 rounded-[12px] border border-gray-02 text-[14px] font-semibold text-gray-07"
        >
          거부
        </button>
        <button
          type="button"
          onClick={() => saveConsent("granted")}
          className="bg-sub-4 h-11 rounded-[12px] text-[14px] font-semibold text-white"
        >
          동의
        </button>
      </div>
    </aside>
  );
}
