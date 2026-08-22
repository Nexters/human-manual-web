import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UnboxingPage from "./UnboxingPage";
import { useTestStore } from "@/stores/testStore";
import { MOCK_RESULT_CODE, mockAssessmentResult } from "@/mocks/assessmentResult";

// 실제 API를 부르는 useAssessmentResult가 마운트 즉시 신선한 캐시를 찾도록 미리 채워둔다.
function createStoryQueryClient() {
  const client = new QueryClient();
  client.setQueryData(["assessmentResult", MOCK_RESULT_CODE], mockAssessmentResult);
  return client;
}

const meta = {
  title: "Pages/UnboxingPage",
  component: UnboxingPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      // UnboxingPage는 resultCode가 없으면 즉시 온보딩으로 리다이렉트한다.
      useTestStore.setState({ resultCode: MOCK_RESULT_CODE });
      return (
        <QueryClientProvider client={createStoryQueryClient()}>
          <MemoryRouter initialEntries={["/unboxing"]}>
            <Routes>
              <Route path="/unboxing" element={<Story />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof UnboxingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// 배송 연출(로딩 → 완료) 초기 화면. 언박싱 조합별 gif/이미지는
// UnboxingStep.stories.tsx / DeliveryStep.stories.tsx에서 개별적으로 다룬다.
export const Default: Story = {};
