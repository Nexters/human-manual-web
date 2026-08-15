import type { Meta, StoryObj } from "@storybook/react-vite";
import SynergyScoreCard from "./SynergyScoreCard";

const meta = {
  title: "Compatibility/SynergyScoreCard",
  component: SynergyScoreCard,
  args: {
    score: 80,
    label: "낼 수 있는 시너지띠",
    description:
      "새로운 일을 시작하면 이 친구는 색다른 시선을 더해줘요. 둘이 대화할수록 아이디어가 선명해져요.",
    tags: ["즉흥적인 케미", "아이디어 시너지"],
  },
} satisfies Meta<typeof SynergyScoreCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LowScore: Story = {
  args: {
    score: 32,
    label: "조율이 필요한 케미",
    description: "서로 다른 속도를 존중하면 더 좋은 팀이 될 수 있어요.",
    tags: ["느긋한 배려"],
  },
};
