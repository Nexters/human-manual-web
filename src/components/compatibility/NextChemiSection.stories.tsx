import type { Meta, StoryObj } from "@storybook/react-vite";
import NextChemiSection from "./NextChemiSection";
import spinningTop from "@/assets/img/compatibility-spinning-top.png";

const meta = {
  title: "Compatibility/NextChemiSection",
  component: NextChemiSection,
  args: {
    myNickname: "지은",
    myImageUrl: spinningTop,
    hasMyCode: true,
    onShareMyChemiLink: () => {},
    onStartTest: () => {},
    onEnterCode: () => {},
    onShareChemiPage: () => {},
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-00 w-[390px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NextChemiSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HasMyCode: Story = {};

export const NoMyCode: Story = {
  args: { hasMyCode: false, myImageUrl: undefined },
};
