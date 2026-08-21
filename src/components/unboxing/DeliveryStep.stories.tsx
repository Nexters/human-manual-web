import type { Meta, StoryObj } from "@storybook/react-vite";
import DeliveryStep from "./DeliveryStep";

const meta = {
  title: "Unboxing/DeliveryStep",
  component: DeliveryStep,
  args: {
    onConfirm: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DeliveryStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { phase: "loading" },
};

export const Done: Story = {
  args: { phase: "done" },
};
