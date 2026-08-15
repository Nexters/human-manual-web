import type { Meta, StoryObj } from "@storybook/react-vite";
import TextField from "./TextField";

const meta = {
  title: "Design System/TextField",
  component: TextField,
  args: {
    placeholder: "이름을 입력해주세요",
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  args: { defaultValue: "이지은" },
};
