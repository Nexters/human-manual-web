import type { Meta, StoryObj } from "@storybook/react-vite";
import Chip from "./Chip";

const meta = {
  title: "Design System/Chip",
  component: Chip,
  args: {
    children: "장난꾸러기",
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colored: Story = {
  args: {
    children: "상위 4%",
    className: "bg-sub-3 text-gray-08",
  },
};
