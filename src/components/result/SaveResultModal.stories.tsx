import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import Modal from "@/components/shared/Modal";
import { useModal } from "@/hooks/useModal";
import SaveResultModal from "./SaveResultModal";

// Modal은 store에 담긴 내용을 #modal-root 포탈로 그리는 공용 컴포넌트라,
// 실제 앱과 동일한 카드·딤 배경까지 보려면 store를 채운 채로 렌더해야 한다.
function SaveResultModalPreview() {
  const { open } = useModal();

  useEffect(() => {
    open({
      title: "결과지를 계정에 보관할까요?",
      contents: <SaveResultModal onLogin={() => {}} onSkip={() => {}} />,
    });
  }, [open]);

  return (
    <>
      <div id="modal-root" />
      <Modal />
    </>
  );
}

const meta = {
  title: "Result/SaveResultModal",
  component: SaveResultModalPreview,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SaveResultModalPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
