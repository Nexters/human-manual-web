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
  await expect(page.getByText("로그인하면 계정에 연결된 궁합을 볼 수 있어요.")).toBeVisible();
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
  await page.getByRole("link", { name: "내 궁합", exact: true }).click();
  await expect(page.getByRole("link", { name: /궁합 82점/ })).toHaveAttribute(
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
