import type { Meta, StoryObj } from "@storybook/react-vite";
import IconLabelCard from "./IconLabelCard";

const meta = {
  title: "Design System/IconLabelCard",
  component: IconLabelCard,
  args: {
    icon: <span className="text-2xl">🍕</span>,
    label: "맛집 정찰대",
  },
} satisfies Meta<typeof IconLabelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};
