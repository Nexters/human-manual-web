import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./Button";

const meta = {
  title: "Design System/Button",
  component: Button,
  args: {
    children: "버튼",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};

export const SolidDisabled: Story = {
  args: { disabled: true },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const OutlineDisabled: Story = {
  args: { variant: "outline", disabled: true },
};
