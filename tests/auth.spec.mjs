import { test, expect } from "@playwright/test";

async function seed(page, { codes = [], scenario = "", loggedIn = false } = {}) {
  await page.addInitScript(
    ({ codes, scenario, loggedIn }) => {
      if (sessionStorage.getItem("auth-test-seeded")) return;
      sessionStorage.setItem("auth-test-seeded", "1");
      if (scenario) sessionStorage.setItem("pakit-auth-mock-scenario", scenario);
      if (loggedIn) sessionStorage.setItem("pakit-auth-mock-session", "1");
      codes.forEach((code, index) => {
        localStorage.setItem(
          index === 0 ? "pakit-result-code" : `pakit-test-e2e-${index}`,
          JSON.stringify({ state: { resultCode: code }, version: 0 }),
        );
      });
    },
    { codes, scenario, loggedIn },
  );
}
async function login(page) {
  await page.getByRole("button", { name: "카카오 로그인", exact: true }).click();
  await expect(page.getByRole("button", { name: "로그아웃", exact: true })).toBeVisible();
}
async function linked(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("pakit-auth-mock-linked") || "[]"));
}

test.beforeEach(async ({ page }) => {
  const productionRequests = [];
  page.on("request", (request) => {
    if (request.url().startsWith("https://api.pakit.kr/")) productionRequests.push(request.url());
  });
  await page.route("https://api.pakit.kr/**", (route) => route.abort());
  page.on("close", () => expect(productionRequests).toEqual([]));
});

test("비로그인 목록은 안내하며 기존 결과는 로그인 없이 조회한다", async ({ page }) => {
  await page.goto("/my/results");
  await expect(page.getByText("로그인하면 계정에 연결된 결과를 볼 수 있어요.")).toBeVisible();
  await page.goto("/my/compatibilities");
  await expect(page.getByText("로그인하면 계정에 연결된 케미를 볼 수 있어요.")).toBeVisible();
  await page.goto("/result/STORYMIN");
  await expect(page.getByText("결과를 불러오지 못했어요")).toHaveCount(0);
  await expect(page.getByText("지은", { exact: false }).first()).toBeVisible();
});

test("로그인 → 모든 로컬 코드 중복 제거/거절 → 원래 URL 복귀 → 목록 매핑", async ({ page }) => {
  await seed(page, { codes: ["STORYMIN", "STORYMIN", "STORYFRI", "BADCODE1"] });
  await page.goto("/my/results?source=local#saved");
  await login(page);
  await expect(page).toHaveURL(/\/my\/results\?source=local#saved$/);
  expect((await linked(page)).sort()).toEqual(["STORYFRI", "STORYMIN"]);
  expect(await page.evaluate(() => sessionStorage.getItem("auth_return_to"))).toBeNull();
  await expect(page.getByRole("link", { name: /지은/ })).toHaveAttribute(
    "href",
    "/result/STORYMIN",
  );
  await expect(page.getByRole("link", { name: /선우/ })).toHaveAttribute(
    "href",
    "/result/STORYFRI",
  );
  await page.getByRole("link", { name: "내 케미", exact: true }).click();
  await expect(page.getByRole("link", { name: /케미 82점/ })).toHaveAttribute(
    "href",
    "/compatibility?mine=STORYMIN&friend=STORYFRI",
  );
  await page.screenshot({
    path: "test-results/auth-my-compatibilities.png",
    animations: "disabled",
  });
});

test("보관 모달의 나중에 선택은 비로그인을 유지하고 카카오 버튼은 결과로 복귀한다", async ({
  page,
}) => {
  await seed(page, { codes: ["STORYMIN"] });
  await page.goto("/result/STORYMIN?source=modal#save");
  const save = page.getByRole("button", { name: "계정에 결과 보관하기", exact: true });
  await expect(page.getByRole("dialog", { name: "이 결과를 계정에 보관할까요?" })).toBeVisible();
  await page.screenshot({ path: "test-results/auth-save-modal.png", animations: "disabled" });
  await page.getByRole("button", { name: "나중에 할게요" }).click();
  expect(await linked(page)).toEqual([]);
  await save.click();
  await page.getByRole("button", { name: "카카오로 로그인하고 보관하기" }).click();
  await expect(page).toHaveURL(/\/result\/STORYMIN\?source=modal#save$/);
  await expect(save).toHaveCount(0);
  expect(await linked(page)).toEqual(["STORYMIN"]);
});

test("로그아웃은 목록과 인증을 초기화하며 로컬 결과 코드와 진행 정보는 보존한다", async ({
  page,
}) => {
  await seed(page, { codes: ["STORYMIN", "STORYFRI"] });
  await page.goto("/my/results");
  await login(page);
  await expect(page.getByRole("link", { name: /지은/ })).toBeVisible();
  const before = await page.evaluate(() => ({
    result: localStorage.getItem("pakit-result-code"),
    test: localStorage.getItem("pakit-test-e2e-1"),
  }));
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page.getByRole("button", { name: "카카오 로그인", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /지은/ })).toHaveCount(0);
  await expect(page.getByText("로그인하면 계정에 연결된 결과를 볼 수 있어요.")).toBeVisible();
  const after = await page.evaluate(() => ({
    result: localStorage.getItem("pakit-result-code"),
    test: localStorage.getItem("pakit-test-e2e-1"),
  }));
  expect(after).toEqual(before);
  await page.reload();
  await expect(page.getByRole("button", { name: "카카오 로그인", exact: true })).toBeVisible();
  await login(page);
  expect((await linked(page)).sort()).toEqual(["STORYFRI", "STORYMIN"]);
});

test("저장된 결과가 없으면 로그인 후 빈 목록을 표시한다", async ({ page }) => {
  await page.goto("/my/results");
  await login(page);
  expect(await linked(page)).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem("pakit-auth-mock-linked"))).toBeNull();
  await expect(page.getByText("아직 계정에 연결된 결과가 없어요.")).toBeVisible();
});

test("결제 내역은 로그인 후 복귀하고 최신 결제와 한국 날짜를 표시한다", async ({ page }) => {
  await page.goto("/my/payments");
  await expect(page.getByText("로그인하면 결제 내역을 확인할 수 있어요.")).toBeVisible();
  await expect(page.getByRole("list", { name: "결제 완료 주문" })).toHaveCount(0);
  await page.getByRole("button", { name: "카카오로 로그인", exact: true }).click();
  await expect(page).toHaveURL(/\/my\/payments$/);
  const orders = page.getByRole("list", { name: "결제 완료 주문" }).getByRole("listitem");
  await expect(orders).toHaveCount(2);
  await expect(orders.nth(0)).toContainText("PKT-1019-87MS");
  await expect(orders.nth(0)).toContainText("2026. 10. 19.");
  await expect(orders.nth(0)).toContainText("₩990");
  await expect(orders.nth(1)).toContainText("PKT-1012-42AB");
  await expect(page.getByRole("link", { name: "결제 내역", exact: true }).first()).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.screenshot({ path: "test-results/payment-history.png", animations: "disabled" });
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await page.getByRole("button", { name: "메뉴 닫기" }).click();
  await expect(orders).toHaveCount(0);
  await expect(page.getByText("로그인하면 결제 내역을 확인할 수 있어요.")).toBeVisible();
});

test("결제 내역의 빈 상태, 오류 재시도, 세션 만료를 처리한다", async ({ page }) => {
  await seed(page, { loggedIn: true, scenario: "payments-empty" });
  await page.goto("/my/payments");
  await expect(page.getByText("아직 결제 내역이 없어요.")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "테스트 시작하기", exact: true }).first(),
  ).toHaveAttribute("href", "/?start=1");
  await page.evaluate(() => sessionStorage.setItem("pakit-auth-mock-scenario", "payments-failure"));
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("결제 내역을 불러오지 못했어요.");
  await page.evaluate(() => sessionStorage.removeItem("pakit-auth-mock-scenario"));
  await page.getByRole("button", { name: "다시 시도" }).click();
  await expect(
    page.getByRole("list", { name: "결제 완료 주문" }).getByRole("listitem"),
  ).toHaveCount(2);
  await page.evaluate(() => sessionStorage.setItem("pakit-auth-mock-scenario", "payments-expired"));
  await page.reload();
  await expect(page.getByText("로그인하면 결제 내역을 확인할 수 있어요.")).toBeVisible();
  await expect(page.getByRole("list", { name: "결제 완료 주문" })).toHaveCount(0);
});

test("프리미엄 결과는 로그인 후 구매 목록과 빈 상태를 보여준다", async ({ page }) => {
  await page.goto("/my/premium");
  await expect(page.getByText("로그인하면 구매한 프리미엄 결과를 확인할 수 있어요.")).toBeVisible();
  await page.getByRole("button", { name: "카카오로 로그인", exact: true }).click();
  await expect(page).toHaveURL(/\/my\/premium$/);
  await expect(
    page.getByRole("list", { name: "구매한 프리미엄 결과" }).getByRole("listitem"),
  ).toHaveCount(2);
  await expect(page.getByRole("link", { name: "리포트 다시 보기" })).toHaveAttribute(
    "href",
    "/my/premium/PKT-1019-87MS",
  );
  await expect(page.getByRole("link", { name: "설명서 만들기" })).toHaveAttribute(
    "href",
    "/my/premium/PKT-1012-42AB",
  );
  const firstPurchase = page
    .getByRole("list", { name: "구매한 프리미엄 결과" })
    .getByRole("listitem")
    .first();
  await expect(firstPurchase.getByText("지은", { exact: true })).toBeVisible();
  await expect(firstPurchase.getByText("선우", { exact: true })).toBeVisible();
  await expect(firstPurchase.getByText("여자", { exact: true })).toBeVisible();
  await expect(firstPurchase.getByText("남자", { exact: true })).toBeVisible();
  await page.screenshot({ path: "test-results/premium-results.png", animations: "disabled" });
  await page.evaluate(() => sessionStorage.setItem("pakit-auth-mock-scenario", "payments-empty"));
  await page.reload();
  await expect(page.getByText("아직 구매한 결과가 없어요.")).toBeVisible();
});

test("프리미엄 결과는 결제 세션 없이 직접 열고 새로고침해도 복원한다", async ({ page }) => {
  await seed(page, { loggedIn: true });
  await page.goto("/my/premium/PKT-1019-87MS");
  await expect(page.getByText("함께 맞춰가는 우리만의 리듬", { exact: true })).toBeVisible();
  await expect(page.getByText("서로 다른 속도를 이해하는 두 사람이에요.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("함께 맞춰가는 우리만의 리듬", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "뒤로가기" }).click();
  await expect(page).toHaveURL(/\/my\/premium$/);
  await page.getByRole("link", { name: "설명서 만들기" }).click();
  await expect(page.getByText("함께 맞춰가는 우리만의 리듬", { exact: true })).toBeVisible();
});

test("프리미엄 결과 불러오기 실패와 잘못된 주문을 처리한다", async ({ page }) => {
  await seed(page, { loggedIn: true, scenario: "premium-failure" });
  await page.goto("/my/premium/PKT-1019-87MS");
  await expect(page.getByRole("alert")).toContainText("구매한 결과를 불러오지 못했어요.");
  await page.evaluate(() => sessionStorage.removeItem("pakit-auth-mock-scenario"));
  await page.getByRole("button", { name: "다시 시도" }).click();
  await expect(page.getByText("함께 맞춰가는 우리만의 리듬", { exact: true })).toBeVisible();
  await page.goto("/my/premium/unknown-order");
  await expect(page.getByRole("alert")).toContainText("구매한 결과를 불러오지 못했어요.");
});

test("결과 동기화 서버 오류도 로그인 성공과 화면 복귀를 막지 않는다", async ({ page }) => {
  await seed(page, { codes: ["STORYMIN"], scenario: "sync-failure" });
  await page.goto("/my/results?source=failure");
  await login(page);
  await expect(page).toHaveURL(/\/my\/results\?source=failure$/);
  expect(await linked(page)).toEqual([]);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("pakit-result-code")).state.resultCode,
    ),
  ).toBe("STORYMIN");
});

test("로그인 확인 실패는 결과 동기화 없이 재로그인 화면을 표시한다", async ({ page }) => {
  await seed(page, { codes: ["STORYMIN"], scenario: "login-failure" });
  await page.goto("/my/results");
  await page.getByRole("button", { name: "카카오 로그인", exact: true }).click();
  await expect(page).toHaveURL(/\/auth\/complete$/);
  await expect(page.getByRole("button", { name: "카카오로 다시 로그인" })).toBeVisible();
  expect(await linked(page)).toEqual([]);
});

test("로그아웃 실패는 인증 및 결과 목록을 유지하고 오류를 안내한다", async ({ page }) => {
  await seed(page, { codes: ["STORYMIN"], scenario: "logout-failure" });
  await page.goto("/my/results");
  await login(page);
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page.getByText("로그아웃하지 못했어요. 다시 시도해 주세요.")).toBeVisible();
  await expect(page.getByRole("button", { name: "로그아웃", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /지은/ })).toBeVisible();
});

test("결제할 수 없는 이전 결과는 서버 안내를 표시하고 결제 화면에 머문다", async ({ page }) => {
  await seed(page, {
    codes: ["STORYMIN"],
    scenario: "payment-mine-retest",
    loggedIn: true,
  });
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "pakit:gender-selection:STORYMIN:STORYFRI",
      JSON.stringify({ mineGender: "여자", partnerGender: "남자" }),
    );
  });
  await page.goto("/compatibility/checkout?mine=STORYMIN&friend=STORYFRI");
  await page.locator("#terms-agreement").check();
  await page.locator("#immediate-provision-agreement").check();
  await page.getByRole("button", { name: "990원 카카오페이로 결제하기" }).click();

  await expect(
    page.getByText(
      "내 결과는 이전 버전이라 유료 분석에 사용할 수 없습니다. 새 테스트를 진행해주세요.",
    ),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/compatibility\/checkout/);
});

test("로그인한 새 테스트 제출은 계정에 연결되며 비로그인 제출도 가능하다", async ({ page }) => {
  await seed(page, { loggedIn: true });
  await page.goto("/my/results");
  await expect(page.getByRole("button", { name: "로그아웃", exact: true })).toBeVisible();
  const result = await page.evaluate(async () => {
    const { submitAssessment } = await import("/src/api/assessment.ts");
    return submitAssessment({
      participant: { nickname: "새 닉네임" },
      answers: [],
      mbti: "ENFP",
      assessment_version: "mock",
    });
  });
  expect(await linked(page)).toEqual([result.result_code]);
  await expect(page.getByRole("link", { name: /새 닉네임/ })).toBeVisible();
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page.getByRole("button", { name: "카카오 로그인", exact: true })).toBeVisible();
  const anonymous = await page.evaluate(async () => {
    const { submitAssessment } = await import("/src/api/assessment.ts");
    return submitAssessment({
      participant: { nickname: "비회원" },
      answers: [],
      mbti: "ENFP",
      assessment_version: "mock",
    });
  });
  expect(anonymous.participant.nickname).toBe("비회원");
  expect(await linked(page)).toEqual([result.result_code]);
});
