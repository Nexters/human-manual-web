import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import OnboardingPage from "@/pages/OnboardingPage";
import QuestionPage from "@/pages/QuestionPage";
import UnboxingPage from "@/pages/UnboxingPage";
import ResultPage from "@/pages/ResultPage";
import CompatibilityPage from "@/pages/CompatibilityPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <OnboardingPage /> },
      { path: "/test/:number", element: <QuestionPage /> },
      { path: "/unboxing", element: <UnboxingPage /> },
      { path: "/result/:id", element: <ResultPage /> },
      { path: "/compatibility", element: <CompatibilityPage /> },
      // 없는 주소로 들어오면 온보딩(첫 화면)으로 돌려보낸다.
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
