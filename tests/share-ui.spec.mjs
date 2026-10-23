import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://api.pakit.kr/**", (route) => route.abort());
  await page.addInitScript(() => {
    sessionStorage.setItem("pakit-save-prompt-dismissed:STORYMIN", "1");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedText = text;
        },
      },
    });
  });
});

async function seedMine(page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "pakit-result-code",
      JSON.stringify({ state: { resultCode: "STORYMIN" }, version: 0 }),
    );
  });
}

test("결과지 코드 UI를 제거해도 결과 공유와 케미 초대 링크는 복사한다", async ({ page }) => {
  await seedMine(page);
  await page.goto("/result/STORYMIN");
  await page.getByRole("button", { name: "↗ 내 결과지 공유", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.copiedText))
    .toBe("http://127.0.0.1:4173/result/STORYMIN");
  await expect(page.locator("body")).not.toContainText("코드");
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await page.getByRole("button", { name: "친구에게 케미 테스트 공유하기", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "친구에게 보낼 문구" })).toHaveValue(
    /friend=STORYMIN/,
  );
  await page.getByRole("button", { name: "링크만 복사하기", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.copiedText))
    .toBe("http://127.0.0.1:4173/?friend=STORYMIN");
});

test("친구 초대 링크는 미리보기와 테스트 시작으로 이어진다", async ({ page }) => {
  await page.goto("/?friend=STORYFRI");
  await expect(page.getByText("선우님이 함께 케미를 보고 싶어 해요")).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "이미 테스트 했다면?" })).toHaveCount(0);
  await page.getByRole("button", { name: "테스트하고 케미 보기", exact: true }).click();
  await expect(page).toHaveURL(/friend=STORYFRI/);
  await expect(page.getByText("선우님이 함께 케미를 보고 싶어 해요")).toHaveCount(0);
});

test("저장된 내 결과로 초대 링크의 케미를 자동 조회하고 다시 초대한다", async ({ page }) => {
  await seedMine(page);
  await page.goto("/?friend=STORYFRI");
  await expect(page).toHaveURL("/compatibility?mine=STORYMIN&friend=STORYFRI");
  await page.getByRole("button", { name: "새 친구와 케미 보기", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.copiedText))
    .toBe("http://127.0.0.1:4173/?friend=STORYMIN");
  await expect(page.locator("body")).not.toContainText("코드");
  await expect(page.getByRole("textbox")).toHaveCount(0);
});

test("보관함과 구매 결과에는 코드가 노출되지 않는다", async ({ page }) => {
  await seedMine(page);
  await page.addInitScript(() => {
    sessionStorage.setItem("pakit-auth-mock-session", "1");
    localStorage.setItem("pakit-auth-mock-linked", JSON.stringify(["STORYMIN"]));
  });
  for (const path of ["/my/results", "/my/compatibilities", "/my/premium"]) {
    await page.goto(path);
    await expect(page.getByText("불러오는 중이에요.", { exact: true })).toHaveCount(0);
    if (path === "/my/premium")
      await expect(page.getByRole("list", { name: "구매한 프리미엄 결과" })).toBeVisible();
    else await expect(page.getByRole("button", { name: /친구에게.*보내기/ })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("코드");
    await expect(page.locator("body")).not.toContainText("STORYMIN");
    await expect(page.getByRole("textbox")).toHaveCount(0);
  }
});

test("예전 코드 조회 주소는 보관함으로 연결한다", async ({ page }) => {
  await page.goto("/load?step=code");
  await expect(page).toHaveURL("/my/results");
  await expect(page.getByRole("button", { name: "카카오로 로그인", exact: true })).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
});
