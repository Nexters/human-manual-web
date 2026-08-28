import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ResultPage from "./ResultPage";
import { useTestStore } from "@/stores/testStore";
import { MOCK_RESULT_CODE, mockAssessmentResult } from "@/mocks/assessmentResult";

const FRIEND_RESULT_CODE = "STORYFRI";
const mockFriendResult = {
  ...mockAssessmentResult,
  result_code: FRIEND_RESULT_CODE,
  participant: { nickname: "선우" },
  overview: { ...mockAssessmentResult.overview, result_name: "곰인형 선우", noun: "곰인형" },
};

function createStoryQueryClient() {
  const client = new QueryClient();
  client.setQueryData(["assessmentResult", MOCK_RESULT_CODE], mockAssessmentResult);
  client.setQueryData(["assessmentResult", FRIEND_RESULT_CODE], mockFriendResult);
  return client;
}

function withResultRoute(initialEntry: string): Decorator {
  return (Story) => (
    <QueryClientProvider client={createStoryQueryClient()}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/result/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Pages/ResultPage",
  component: ResultPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ResultPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// 내 결과지를 보는 경우. ShareResult가 testStore.resultCode와 URL의 id를 비교해
// "내 코드" 카드를 보여주므로, 렌더 전에 testStore를 같은 코드로 시딩해둔다.
export const Default: Story = {
  decorators: [
    (Story) => {
      useTestStore.setState({ resultCode: MOCK_RESULT_CODE });
      return <Story />;
    },
    withResultRoute(`/result/${MOCK_RESULT_CODE}`),
  ],
};

// 친구 초대 링크(?friend=)로 들어와 테스트를 마친 경우.
// ShareResult 첫 버튼이 "OO님과 테스트 바로 확인"으로 바뀐다.
export const ViewingFriendResult: Story = {
  decorators: [
    (Story) => {
      useTestStore.setState({ resultCode: null });
      return <Story />;
    },
    withResultRoute(`/result/${MOCK_RESULT_CODE}?friend=${FRIEND_RESULT_CODE}`),
  ],
};
