import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CompatibilityPage from "./CompatibilityPage";
import { compatibilityQueryKey } from "@/hooks/useCompatibility";
import { MOCK_MINE_CODE, MOCK_FRIEND_CODE, mockCompatibility } from "@/mocks/compatibility";

// 실제 API를 부르는 useCompatibility가 마운트 즉시 신선한 캐시를 찾도록 미리 채워둔다.
// 그래야 스토리가 진짜 네트워크 요청 없이 완성된 화면을 바로 그린다.
function createStoryQueryClient() {
  const client = new QueryClient();
  client.setQueryData(compatibilityQueryKey(MOCK_MINE_CODE, MOCK_FRIEND_CODE), mockCompatibility);
  return client;
}

const meta = {
  title: "Pages/CompatibilityPage",
  component: CompatibilityPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={createStoryQueryClient()}>
        <MemoryRouter
          initialEntries={[`/compatibility?mine=${MOCK_MINE_CODE}&friend=${MOCK_FRIEND_CODE}`]}
        >
          <Routes>
            <Route path="/compatibility" element={<Story />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof CompatibilityPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
