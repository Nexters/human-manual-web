import type { Meta, StoryObj } from "@storybook/react-vite";
import SplashScreen from "./SplashScreen";

const meta = {
  title: "Onboarding/SplashScreen",
  component: SplashScreen,
  args: {
    onStart: () => {},
    onCheckCompatibility: () => {},
    onOpenMyResult: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SplashScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithParticipantCount: Story = {
  args: { participantCount: 12345 },
};

export const WithoutParticipantCount: Story = {};
