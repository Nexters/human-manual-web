import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ------- 내 결과 코드 보관 ------
// testStore 와 따로 사는 이유가 두 가지다.
//
// 1. testStore.reset() 은 "테스트 시작"·"테스트 다시 하기" 에서 진행 상태를 통째로 비운다.
//    이미 테스트를 마친 사람이 실수로 그 버튼을 눌러도 결과 코드는 남아야 한다 —
//    로그인이 없어 이 코드가 결과지·케미에 닿는 유일한 열쇠다.
// 2. testStore 의 키에는 ASSESSMENT_VERSION 이 붙어 있어 문항이 개정되면 폐기된다.
//    결과 코드는 문항 버전과 무관하게 계속 유효하므로 버전 없는 키에 둔다.
const STORAGE_KEY = "pakit-result-code";

type MyResultState = {
  /** 이 브라우저에서 테스트를 마친 사람의 결과 코드. 없으면 null. */
  resultCode: string | null;
};

type MyResultActions = {
  setResultCode: (resultCode: string) => void;
  clearResultCode: () => void;
};

export const useMyResultStore = create<MyResultState & MyResultActions>()(
  persist(
    (set) => ({
      resultCode: null,

      setResultCode: (resultCode) => set({ resultCode }),

      clearResultCode: () => set({ resultCode: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
