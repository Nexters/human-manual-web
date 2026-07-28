import { createBrowserRouter } from "react-router-dom";
import OnboardingPage from "@/pages/OnboardingPage";
import QuestionPage from "@/pages/QuestionPage";
import UnboxingPage from "@/pages/UnboxingPage";
import ResultPage from "@/pages/ResultPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <OnboardingPage /> },
  { path: "/question", element: <QuestionPage /> },
  { path: "/unboxing", element: <UnboxingPage /> },
  { path: "/result", element: <ResultPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
