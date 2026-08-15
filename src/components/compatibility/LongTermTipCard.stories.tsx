import type { Meta, StoryObj } from "@storybook/react-vite";
import LongTermTipCard from "./LongTermTipCard";

const meta = {
  title: "Compatibility/LongTermTipCard",
  component: LongTermTipCard,
  args: {
    title: "더 오래 잘 지내려면",
    description:
      "서로의 속도를 바꾸려 하기보다 차이를 이해해 주세요. 팽이는 갑작스러운 계획을 미리 알려주고, 비밀상자는 불편한 마음을 참지 않고 표현하면 돼요.",
  },
} satisfies Meta<typeof LongTermTipCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
