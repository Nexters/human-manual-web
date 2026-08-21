export const GA_EVENTS = {
  // 온보딩 관련 GA 이벤트
  ONBOARDING: {
    // label은 호출부(OnboardingPage.tsx handleStartTest)에서 진입 목적별로 항상 덮어써서 전송됨
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
    // label은 호출부(QuestionPage.tsx)에서 문항 순번으로 덮어써서 전송됨.
    // order가 바뀔 때마다(앞으로/뒤로/진행바 이동 모두) 매번 전송되어
    // 같은 순번에 여러 번 찍힐 수 있지만, 문항별 도달 이탈 지점 분석에는
    // 세션당 도달 여부만 보면 되므로 중복 자체는 문제되지 않음
    VIEW: {
      action: "question_view",
      category: "question",
      label: "",
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
    // 1번 문항에서 뒤로가기(테스트 자체 이탈)만 전송됨. 2~21번 사이 일반
    // 뒤로가기는 노이즈가 커서 의도적으로 제외함
    EXIT: {
      action: "test_exit",
      category: "question",
      label: "1번_문항에서_뒤로가기",
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
    // label은 호출부(ResultPage.tsx)에서 결과 캐릭터명으로 덮어써서 전송되며,
    // 같은 결과 코드에 대해서는 refetch가 일어나도 1회만 전송됨
    VIEW: {
      action: "result_view",
      category: "result",
      label: "결과_페이지_조회",
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
    CHEMI_TEST_OPEN: {
      action: "chemi_test_open",
      category: "result",
      label: "친구_케미_테스트_열기",
    },
    CHEMI_TEST_SHARE: {
      action: "chemi_test_share",
      category: "result",
      label: "친구_케미_테스트_문구공유",
    },
    RETRY: {
      action: "result_retry",
      category: "result",
      label: "결과페이지_테스트_새로보기",
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
