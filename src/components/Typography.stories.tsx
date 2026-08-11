import type { Meta, StoryObj } from "@storybook/react-vite";
import Typography from "./Typography";

const meta = {
  title: "Design System/Typography",
  component: Typography,
  args: {
    children: "패킷 나 사용 설명서",
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = { args: { variant: "h1" } };
export const H2: Story = { args: { variant: "h2" } };
export const H3: Story = { args: { variant: "h3" } };
export const SB1: Story = { args: { variant: "sb1" } };
export const SB2: Story = { args: { variant: "sb2" } };
export const SB3: Story = { args: { variant: "sb3" } };
export const SB4: Story = { args: { variant: "sb4" } };
export const ME1: Story = { args: { variant: "me1" } };
export const ME2: Story = { args: { variant: "me2" } };
export const ME3: Story = { args: { variant: "me3" } };
export const ME4: Story = { args: { variant: "me4" } };
