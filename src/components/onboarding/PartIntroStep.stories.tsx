import type { Meta, StoryObj } from "@storybook/react-vite";
import PartIntroStep from "./PartIntroStep";

const meta = {
  title: "Onboarding/PartIntroStep",
  component: PartIntroStep,
  args: {
    onBack: () => {},
    onNext: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PartIntroStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
