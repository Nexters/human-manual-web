import type { Meta, StoryObj } from "@storybook/react-vite";
import NameInputStep from "./NameInputStep";

const meta = {
  title: "Onboarding/NameInputStep",
  component: NameInputStep,
  args: {
    name: "",
    onNameChange: () => {},
    onNext: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof NameInputStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  args: { name: "지은" },
};
