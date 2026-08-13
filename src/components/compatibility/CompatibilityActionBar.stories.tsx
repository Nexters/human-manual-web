import type { Meta, StoryObj } from "@storybook/react-vite";
import CompatibilityActionBar from "./CompatibilityActionBar";

const meta = {
  title: "Compatibility/CompatibilityActionBar",
  component: CompatibilityActionBar,
  decorators: [
    (Story) => (
      <div className="w-[390px] bg-gray-100 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompatibilityActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
