import type { Meta, StoryObj } from "@storybook/react-vite";
import InvitePreviewStep from "./InvitePreviewStep";
import bearLarge from "@/assets/img/compatibility-bear-large.png";

const meta = {
  title: "Onboarding/InvitePreviewStep",
  component: InvitePreviewStep,
  args: {
    friendNickname: "선우",
    friendNoun: "곰인형",
    friendImageUrl: bearLarge,
    onStart: () => {},
    onCheckExistingCode: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof InvitePreviewStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
