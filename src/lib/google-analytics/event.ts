export const GA_EVENTS = {
  // 온보딩 관련 GA 이벤트
  ONBOARDING: {
    TEST_START: {
      action: "test_start",
      category: "onboarding",
      label: "테스트_시작",
    },
    COMPATIBILITY_START: {
      action: "compatibility_start",
      category: "onboarding",
      label: "궁합_확인_시작",
    },
  },

  // 문항 진행 관련 GA 이벤트
  QUESTION: {
    STEP1_COMPLETE: {
      action: "step1_complete",
      category: "question",
      label: "1단계_완료",
    },
    SUBMIT_COMPLETE: {
      action: "test_submit_complete",
      category: "question",
      label: "장난감_배송하기_성공",
    },
    SUBMIT_FAIL: {
      action: "test_submit_fail",
      category: "question",
      label: "장난감_배송하기_실패",
    },
    RESET: {
      action: "test_reset",
      category: "question",
      label: "검사_다시하기",
    },
    SEEK: {
      action: "question_seek",
      category: "question",
      label: "진행바_이동",
    },
  },

  // 배송/언박싱 관련 GA 이벤트
  UNBOXING: {
    DELIVERY_CONFIRM: {
      action: "unboxing_delivery_confirm",
      category: "unboxing",
      label: "택배_확인하기",
    },
    OPEN_CONFIRM: {
      action: "unboxing_open_confirm",
      category: "unboxing",
      label: "장난감_확인하기",
    },
  },

  // 결과 페이지 관련 GA 이벤트
  RESULT: {
    VIEW: {
      action: "result_view",
      category: "result",
      label: "결과_페이지_조회",
    },
    CODE_COPY: {
      action: "result_code_copy",
      category: "result",
      label: "결과페이지_코드복사",
    },
    INVITE_OPEN: {
      action: "compatibility_invite_open",
      category: "result",
      label: "친구_궁합_자세히보기",
    },
    INVITE_CODE_COPY: {
      action: "compatibility_invite_code_copy",
      category: "result",
      label: "친구초대_코드복사",
    },
    INVITE_LINK_SHARE: {
      action: "compatibility_invite_link_share",
      category: "result",
      label: "친구초대_링크공유",
    },
  },

  // 궁합 페이지 관련 GA 이벤트
  COMPATIBILITY: {
    RESULT_SHARE: {
      action: "compatibility_result_share",
      category: "compatibility",
      label: "궁합페이지_결과지공유",
    },
  },
} as const;
