import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[440px] bg-white">
      <Outlet />
    </div>
  );
}
