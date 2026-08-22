import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import QuestionPage from "./QuestionPage";
import { useTestStore } from "@/stores/testStore";
import { buildMockAnswers, MOCK_NICKNAME } from "@/mocks/testAnswers";

// 문항 kind별 대표 order. 실제 문항 구성이 바뀌면 constants/questions.ts에서
// 다시 확인해야 한다.
const ORDER_BY_KIND = {
  choice: 1,
  carousel: 8,
  scale: 12,
  integer: 14,
  action: 20,
  mbti: 21,
} as const;

function withOrder(order: number): Decorator {
  return (Story) => {
    // canEnterOrder는 "이전 문항에 다 답했는지"만 보므로, 전부 채워두면
    // 어떤 order로 바로 진입해도 리다이렉트되지 않는다.
    const { answers, mbti } = buildMockAnswers();
    useTestStore.setState({ nickname: MOCK_NICKNAME, answers, mbti });
    return (
      <MemoryRouter initialEntries={[`/test/${order}`]}>
        <Routes>
          <Route path="/test/:number" element={<Story />} />
        </Routes>
      </MemoryRouter>
    );
  };
}

const meta = {
  title: "Pages/QuestionPage",
  component: QuestionPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof QuestionPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Choice: Story = {
  decorators: [withOrder(ORDER_BY_KIND.choice)],
};

export const Carousel: Story = {
  decorators: [withOrder(ORDER_BY_KIND.carousel)],
};

export const Scale: Story = {
  decorators: [withOrder(ORDER_BY_KIND.scale)],
};

export const Integer: Story = {
  decorators: [withOrder(ORDER_BY_KIND.integer)],
};

export const Action: Story = {
  decorators: [withOrder(ORDER_BY_KIND.action)],
};

export const Mbti: Story = {
  decorators: [withOrder(ORDER_BY_KIND.mbti)],
};
