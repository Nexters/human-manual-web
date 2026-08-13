import type { Meta, StoryObj } from "@storybook/react-vite";
import MatchupProfileCard from "./MatchupProfileCard";
import spinningTop from "@/assets/img/compatibility-spinning-top.png";
import bearLarge from "@/assets/img/compatibility-bear-large.png";

const meta = {
  title: "Compatibility/MatchupProfileCard",
  component: MatchupProfileCard,
  args: {
    role: "나",
    name: "팽이 지은",
    image: spinningTop,
    imageAlt: "팽이 캐릭터",
  },
} satisfies Meta<typeof MatchupProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Me: Story = {};

export const Friend: Story = {
  args: {
    variant: "friend",
    role: "친구",
    name: "곰인형 선우",
    image: bearLarge,
    imageAlt: "곰인형 캐릭터",
  },
};
