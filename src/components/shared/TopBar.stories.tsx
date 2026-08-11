import type { Meta, StoryObj } from "@storybook/react-vite";
import TopBar from "./TopBar";

const meta = {
  title: "Design System/TopBar",
  component: TopBar,
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: { title: "친구와의 궁합" },
};

export const WithBack: Story = {
  args: { title: "친구와의 궁합", onBack: () => {} },
};
