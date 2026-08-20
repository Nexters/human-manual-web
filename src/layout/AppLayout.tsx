import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/google-analytics";

export default function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[440px] bg-white">
      <Outlet />
    </div>
  );
}
