import type { Meta, StoryObj } from "@storybook/react-vite";
import RelationshipGuidePurchaseCard from "./RelationshipGuidePurchaseCard";

const meta = {
  title: "Compatibility/RelationshipGuidePurchaseCard",
  component: RelationshipGuidePurchaseCard,
  parameters: {
    layout: "padded",
  },
  args: {
    mineNickname: "지은",
    friendNickname: "선우",
    onPurchase: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[400px] bg-gray-00 p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RelationshipGuidePurchaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongNicknames: Story = {
  args: {
    mineNickname: "사랑스러운테디베어",
    friendNickname: "빙글빙글팽이대장",
  },
};
