import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import PaymentHistoryPage from "./PaymentHistoryPage";
import { accountQueryKey, authQueryKey } from "@/hooks/useAuth";
import { MOCK_FRIEND_CODE, MOCK_MINE_CODE, mockCompatibility } from "@/mocks/compatibility";
import type { AccountCompatibility, AccountResult } from "@/api/auth";

const user = { user_id: 1, created_at: "2026-11-06T00:00:00Z" };

const toAccountResult = (
  resultCode: string,
  person: typeof mockCompatibility.mine,
): AccountResult => ({
  result_code: resultCode,
  nickname: person.nickname,
  result_name: person.noun,
  noun: person.noun,
  character_id: person.character_id,
  image_url: person.image_url,
  created_at: "2026-11-06T00:00:00Z",
  is_legacy: person.is_legacy,
});

const compatibility: AccountCompatibility = {
  mine: toAccountResult(MOCK_MINE_CODE, mockCompatibility.mine),
  friend: toAccountResult(MOCK_FRIEND_CODE, mockCompatibility.friend),
  score: 74,
  tested_at: "2026-11-06T00:00:00Z",
};

function createStoryQueryClient() {
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
  client.setQueryData(authQueryKey, user);
  client.setQueryData([...accountQueryKey, user.user_id, "payments"], { total: 0, items: [] });
  client.setQueryData([...accountQueryKey, user.user_id, "compatibilities"], {
    total: 1,
    items: [compatibility],
  });
  return client;
}

const meta = {
  title: "Pages/PaymentHistoryPage",
  component: PaymentHistoryPage,
  args: { kind: "premium" },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <QueryClientProvider client={createStoryQueryClient()}>
        <MemoryRouter initialEntries={["/my/premium"]}>
          <div className="mx-auto min-h-dvh w-full max-w-[440px] bg-white">
            <Story />
          </div>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof PaymentHistoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyWithCompatibilities: Story = {};
