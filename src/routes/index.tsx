import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import OnboardingPage from "@/pages/OnboardingPage";
import QuestionPage from "@/pages/QuestionPage";
import UnboxingPage from "@/pages/UnboxingPage";
import ResultPage from "@/pages/ResultPage";
import CompatibilityPage from "@/pages/CompatibilityPage";
import RelationshipGuideCheckoutPage from "@/pages/RelationshipGuideCheckoutPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import RefundPolicyPage from "@/pages/RefundPolicyPage";

import AuthCompletePage from "@/pages/AuthCompletePage";
import MyAccountPage from "@/pages/MyAccountPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/auth/complete", element: <AuthCompletePage /> },
      { path: "/my/results", element: <MyAccountPage kind="results" /> },
      { path: "/my/compatibilities", element: <MyAccountPage kind="compatibilities" /> },
      { path: "/", element: <OnboardingPage /> },
      { path: "/test/:number", element: <QuestionPage /> },
      { path: "/unboxing", element: <UnboxingPage /> },
      { path: "/result/:id", element: <ResultPage /> },
      { path: "/compatibility", element: <CompatibilityPage /> },
      { path: "/compatibility/checkout", element: <RelationshipGuideCheckoutPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/refund-policy", element: <RefundPolicyPage /> },
      // 없는 주소로 들어오면 온보딩(첫 화면)으로 돌려보낸다.
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
