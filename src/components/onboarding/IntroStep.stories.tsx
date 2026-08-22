import type { Meta, StoryObj } from "@storybook/react-vite";
import IntroStep from "./IntroStep";

const meta = {
  title: "Onboarding/IntroStep",
  component: IntroStep,
  args: {
    onBack: () => {},
    onNext: () => {},
    onSkip: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof IntroStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Greeting: Story = {
  args: { step: "greeting" },
};

export const Surprised: Story = {
  args: { step: "surprised" },
};

export const Guide: Story = {
  args: { step: "guide" },
};
