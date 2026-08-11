import type { Meta, StoryObj } from "@storybook/react-vite";
import InfoCard from "./InfoCard";

const meta = {
  title: "Design System/InfoCard",
  component: InfoCard,
  args: {
    icon: <span className="text-4xl">🧸</span>,
    title: "지은님에게",
    description: "갑작스러운 변화는 미리 알려주고 직설적인 말은 부드럽게 다듬어주세요.",
  },
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
