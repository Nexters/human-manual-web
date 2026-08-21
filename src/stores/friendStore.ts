import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "pakit-friend";

type FriendState = {
  friendCode: string | null;
};

type FriendActions = {
  rememberFriendCode: (code: string) => void;
};

/**
 * 친구 링크로 들어온 사람의 친구 코드를 이 탭에 기억해둔다.
 *
 * friend 코드는 URL 쿼리로 이어지지만, 쿼리를 이어붙이지 않는 이동이 한 번이라도 끼면
 * 그 지점에서 친구 문맥이 끊긴다. 어떤 경로로 테스트를 마쳤든 결과지에서 그 친구와의
 * 케미를 볼 수 있어야 하므로, URL 과 별도로 보관한다.
 *
 * 테스트 진행 상황(testStore)과 달리 sessionStorage 를 쓴다. 탭을 닫으면 잊는 게 맞다.
 * 남겨두면 나중에 혼자 들어온 사람에게도 예전 친구가 계속 따라붙는다.
 */
export const useFriendStore = create<FriendState & FriendActions>()(
  persist(
    (set) => ({
      friendCode: null,

      rememberFriendCode: (code) =>
        set((state) => (state.friendCode === code ? state : { friendCode: code })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
