import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ASSESSMENT_VERSION } from "@/constants/assessment";
import { MBTI_AXES } from "@/types/assessment";
import type { AnswerValue, MbtiAxisKey, MbtiSelection } from "@/types/assessment";
import { QUESTIONS } from "@/constants/questions";

const STORAGE_PREFIX = "pakit-test-";
const STORAGE_KEY = `${STORAGE_PREFIX}${ASSESSMENT_VERSION}`;

const dropStaleVersions = () => {
  if (typeof localStorage === "undefined") return;
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(STORAGE_PREFIX) && key !== STORAGE_KEY) {
      localStorage.removeItem(key);
    }
  }
};
dropStaleVersions();

type TestState = {
  nickname: string;
  answers: Record<string, AnswerValue>;
  mbti: MbtiSelection;
  resultCode: string | null;
};

type TestActions = {
  setNickname: (nickname: string) => void;
  setAnswer: (questionId: string, value: AnswerValue) => void;
  clearAnswer: (questionId: string) => void;
  setMbtiAxis: (axis: MbtiAxisKey, pole: string) => void;
  setResultCode: (code: string) => void;
  reset: () => void;
};

const initialState: TestState = {
  nickname: "",
  answers: {},
  mbti: {},
  resultCode: null,
};

export const useTestStore = create<TestState & TestActions>()(
  persist(
    (set) => ({
      ...initialState,

      setNickname: (nickname) => set({ nickname }),

      setAnswer: (questionId, value) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: value } })),

      clearAnswer: (questionId) =>
        set((state) => {
          const rest = { ...state.answers };
          delete rest[questionId];
          return { answers: rest };
        }),

      setMbtiAxis: (axis, pole) => set((state) => ({ mbti: { ...state.mbti, [axis]: pole } })),

      setResultCode: (resultCode) => set({ resultCode }),

      reset: () => set({ answers: {}, mbti: {}, resultCode: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const toMbtiString = (mbti: MbtiSelection): string | null => {
  const letters = MBTI_AXES.map((axis) => mbti[axis.key]);
  if (letters.some((letter) => !letter)) return null;
  return letters.join("");
};

export const findFirstIncompleteOrder = (
  answers: Record<string, AnswerValue>,
  mbti: MbtiSelection,
): number => {
  for (const question of QUESTIONS) {
    if (question.kind === "mbti") {
      if (!toMbtiString(mbti)) return question.order;
      continue;
    }
    if (answers[question.questionId] === undefined) return question.order;
  }
  return QUESTIONS.length;
};

export const canEnterOrder = (
  order: number,
  answers: Record<string, AnswerValue>,
  mbti: MbtiSelection,
): boolean => {
  return order <= findFirstIncompleteOrder(answers, mbti);
};
