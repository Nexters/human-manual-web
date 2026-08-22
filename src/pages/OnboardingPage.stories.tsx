import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OnboardingPage from "./OnboardingPage";

// completedTestCount는 실패해도 화면이 성립하는 장식 값이지만, 실제 fetch가
// 나가지 않도록 캐시를 미리 채워둔다.
function createStoryQueryClient() {
  const client = new QueryClient();
  client.setQueryData(["completedTestCount"], 1234);
  return client;
}

const meta = {
  title: "Pages/OnboardingPage",
  component: OnboardingPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={createStoryQueryClient()}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof OnboardingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// 스플래시 CTA(첫 화면) 상태. 이후 스텝(인트로/이름입력/파트인트로/초대미리보기)은
// 페이지 내부 state로만 전환돼서, 각 컴포넌트 자체 스토리(SplashScreen 등)에서 다룬다.
export const Default: Story = {};
