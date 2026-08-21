import type { Meta, StoryObj } from "@storybook/react-vite";
import UnboxingStep from "./UnboxingStep";

const meta = {
  title: "Unboxing/UnboxingStep",
  component: UnboxingStep,
  args: {
    onConfirm: () => {},
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof UnboxingStep>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- fragile_box -----
export const FragileBoxGloveLoading: Story = {
  args: { phase: "loading", packagingType: "fragile_box", openingToolType: "glove" },
};
export const FragileBoxGloveDone: Story = {
  args: { phase: "done", packagingType: "fragile_box", openingToolType: "glove" },
};
export const FragileBoxUtilityKnifeLoading: Story = {
  args: { phase: "loading", packagingType: "fragile_box", openingToolType: "utility_knife" },
};
export const FragileBoxUtilityKnifeDone: Story = {
  args: { phase: "done", packagingType: "fragile_box", openingToolType: "utility_knife" },
};
export const FragileBoxMagicWandLoading: Story = {
  args: { phase: "loading", packagingType: "fragile_box", openingToolType: "magic_wand" },
};
export const FragileBoxMagicWandDone: Story = {
  args: { phase: "done", packagingType: "fragile_box", openingToolType: "magic_wand" },
};
export const FragileBoxChainsawLoading: Story = {
  args: { phase: "loading", packagingType: "fragile_box", openingToolType: "chainsaw" },
};
export const FragileBoxChainsawDone: Story = {
  args: { phase: "done", packagingType: "fragile_box", openingToolType: "chainsaw" },
};

// ----- minimal_box -----
export const MinimalBoxGloveLoading: Story = {
  args: { phase: "loading", packagingType: "minimal_box", openingToolType: "glove" },
};
export const MinimalBoxGloveDone: Story = {
  args: { phase: "done", packagingType: "minimal_box", openingToolType: "glove" },
};
export const MinimalBoxUtilityKnifeLoading: Story = {
  args: { phase: "loading", packagingType: "minimal_box", openingToolType: "utility_knife" },
};
export const MinimalBoxUtilityKnifeDone: Story = {
  args: { phase: "done", packagingType: "minimal_box", openingToolType: "utility_knife" },
};
export const MinimalBoxMagicWandLoading: Story = {
  args: { phase: "loading", packagingType: "minimal_box", openingToolType: "magic_wand" },
};
export const MinimalBoxMagicWandDone: Story = {
  args: { phase: "done", packagingType: "minimal_box", openingToolType: "magic_wand" },
};
export const MinimalBoxChainsawLoading: Story = {
  args: { phase: "loading", packagingType: "minimal_box", openingToolType: "chainsaw" },
};
export const MinimalBoxChainsawDone: Story = {
  args: { phase: "done", packagingType: "minimal_box", openingToolType: "chainsaw" },
};

// ----- matryoshka_box -----
export const MatryoshkaBoxGloveLoading: Story = {
  args: { phase: "loading", packagingType: "matryoshka_box", openingToolType: "glove" },
};
export const MatryoshkaBoxGloveDone: Story = {
  args: { phase: "done", packagingType: "matryoshka_box", openingToolType: "glove" },
};
export const MatryoshkaBoxUtilityKnifeLoading: Story = {
  args: { phase: "loading", packagingType: "matryoshka_box", openingToolType: "utility_knife" },
};
export const MatryoshkaBoxUtilityKnifeDone: Story = {
  args: { phase: "done", packagingType: "matryoshka_box", openingToolType: "utility_knife" },
};
export const MatryoshkaBoxMagicWandLoading: Story = {
  args: { phase: "loading", packagingType: "matryoshka_box", openingToolType: "magic_wand" },
};
export const MatryoshkaBoxMagicWandDone: Story = {
  args: { phase: "done", packagingType: "matryoshka_box", openingToolType: "magic_wand" },
};
export const MatryoshkaBoxChainsawLoading: Story = {
  args: { phase: "loading", packagingType: "matryoshka_box", openingToolType: "chainsaw" },
};
export const MatryoshkaBoxChainsawDone: Story = {
  args: { phase: "done", packagingType: "matryoshka_box", openingToolType: "chainsaw" },
};

// ----- locked_box -----
export const LockedBoxGloveLoading: Story = {
  args: { phase: "loading", packagingType: "locked_box", openingToolType: "glove" },
};
export const LockedBoxGloveDone: Story = {
  args: { phase: "done", packagingType: "locked_box", openingToolType: "glove" },
};
export const LockedBoxUtilityKnifeLoading: Story = {
  args: { phase: "loading", packagingType: "locked_box", openingToolType: "utility_knife" },
};
export const LockedBoxUtilityKnifeDone: Story = {
  args: { phase: "done", packagingType: "locked_box", openingToolType: "utility_knife" },
};
export const LockedBoxMagicWandLoading: Story = {
  args: { phase: "loading", packagingType: "locked_box", openingToolType: "magic_wand" },
};
export const LockedBoxMagicWandDone: Story = {
  args: { phase: "done", packagingType: "locked_box", openingToolType: "magic_wand" },
};
export const LockedBoxChainsawLoading: Story = {
  args: { phase: "loading", packagingType: "locked_box", openingToolType: "chainsaw" },
};
export const LockedBoxChainsawDone: Story = {
  args: { phase: "done", packagingType: "locked_box", openingToolType: "chainsaw" },
};
