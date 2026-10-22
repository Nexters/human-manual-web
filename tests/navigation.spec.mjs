import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const { assessment_version: assessmentVersion } = JSON.parse(
  readFileSync(new URL("../src/constants/assessment-identifiers.v1.json", import.meta.url), "utf8"),
);

const pages = [
  "/",
  "/?start=1",
  "/test/1",
  "/unboxing",
  "/support",
  "/load",
  "/my/results",
  "/my/compatibilities",
  "/my/payments",
  "/my/premium",
  "/my/premium/test-order",
  "/result/STORYMIN",
  "/compatibility",
  "/compatibility/checkout",
  "/compatibility/report/gender",
  "/payments/kakaopay/complete",
  "/terms",
  "/privacy",
  "/refund-policy",
];

for (const path of pages) {
  test(`${path}에서 공통 메뉴를 열고 문의 페이지로 이동한다`, async ({ page }) => {
    await page.route("https://api.pakit.kr/**", (route) => route.abort());
    await page.addInitScript((assessmentVersion) => {
      sessionStorage.setItem("pakit-save-prompt-dismissed:STORYMIN", "1");
      localStorage.setItem(
        `pakit-test-${assessmentVersion}`,
        JSON.stringify({
          state: { nickname: "테스트", answers: {}, mbti: {}, resultCode: "STORYMIN" },
          version: 0,
        }),
      );
    }, assessmentVersion);
    await page.goto(path);
    await expect(page).toHaveURL(path);
    const menu = page.getByRole("button", { name: "메뉴 열기", exact: true });
    await expect(menu).toHaveCount(1);
    await menu.click();
    const navigation = page.getByRole("navigation", { name: "전체 메뉴", exact: true });
    await expect(navigation).toBeVisible();
    await navigation.getByRole("link", { name: "문의하기", exact: true }).click();
    await expect(page).toHaveURL("/support");
    await expect(navigation).toBeHidden();
    await expect(menu).toHaveCount(1);
  });
}

test("결과 화면을 스크롤해도 메뉴와 뒤로가기 버튼이 겹치지 않는다", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("pakit-save-prompt-dismissed:STORYMIN", "1");
  });
  await page.goto("/result/STORYMIN");
  const back = page.getByRole("button", { name: "뒤로가기", exact: true });
  await expect(back).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 500));
  const header = page.locator(".pakit-header");
  const headerBox = await header.boundingBox();
  const backBox = await back.boundingBox();
  expect(headerBox.y).toBe(0);
  expect(backBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
  await page.getByRole("button", { name: "메뉴 열기", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "전체 메뉴", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "전체 메뉴", exact: true })).toBeHidden();
});
