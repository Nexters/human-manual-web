import type { Meta, StoryObj } from "@storybook/react-vite";
import DetailAccordionItem from "./DetailAccordionItem";
import distanceIcon from "@/assets/img/compatibility/distance.png";

const meta = {
  title: "Compatibility/DetailAccordionItem",
  component: DetailAccordionItem,
  args: {
    icon: distanceIcon,
    question: "우리 사이의 거리감은?",
    description:
      "지은님은 자주 연결될수록 안심하고, 선우님은 각자의 시간을 보장 받을수록 편해져요. 애정의 크기보다 편한 간격이 다른 사이예요.",
    onToggle: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DetailAccordionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: { isOpen: false },
};

export const Expanded: Story = {
  args: { isOpen: true },
};
