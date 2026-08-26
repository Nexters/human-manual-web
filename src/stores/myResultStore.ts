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

// testStore 의 키 접두사. 그쪽은 뒤에 ASSESSMENT_VERSION 이 붙는다.
const TEST_STORE_PREFIX = "pakit-test-";

// ------- 예전 키에서 한 번 옮겨오기 ------
// 이 스토어가 생기기 전에 테스트를 마친 사람은 결과 코드가 testStore 키에만 있다.
// 그대로 두면 이미 코드를 가진 사람에게도 "나" 자리가 비어 보이므로, 첫 로드에 한 번 옮긴다.
// 옛 키는 지우지 않는다 — 진행 상태 복원(중단한 문항부터 이어가기)에 아직 쓰인다.
const seedFromTestStore = () => {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(STORAGE_KEY)) return;

  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith(TEST_STORE_PREFIX)) continue;

    try {
      const raw = localStorage.getItem(key);
      const code = raw
        ? (JSON.parse(raw) as { state?: { resultCode?: unknown } }).state?.resultCode
        : null;
      if (typeof code === "string" && code !== "") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ state: { resultCode: code }, version: 0 }),
        );
        return;
      }
    } catch {
      // 손상된 값은 건너뛴다
    }
  }
};
seedFromTestStore();

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
