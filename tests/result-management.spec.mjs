import { test, expect } from "@playwright/test";

test("대표 결과를 선택하면 홈·케미 기준으로 유지되고 삭제해도 재동기화로 복원되지 않는다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("management-seeded")) return;
    sessionStorage.setItem("management-seeded", "1");
    sessionStorage.setItem("pakit-auth-mock-session", "1");
    localStorage.setItem("pakit-auth-mock-linked", JSON.stringify(["STORYMIN", "STORYFRI"]));
    localStorage.setItem(
      "pakit-result-code",
      JSON.stringify({ state: { resultCode: "STORYMIN" }, version: 0 }),
    );
    localStorage.setItem(
      "pakit-test-e2e-hidden",
      JSON.stringify({ state: { resultCode: "STORYFRI" }, version: 0 }),
    );
  });
  await page.goto("/my/results");
  await page.getByText("다른 결과도 보기", { exact: true }).click();
  await page.screenshot({ path: "/tmp/pakit-result-management.png", fullPage: true });
  await page.getByRole("button", { name: /선우 대표로 설정/ }).click();
  await expect(page.getByRole("button", { name: /선우 대표로 설정/ })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("button", { name: /선우 대표로 설정/ })).toHaveCount(0);
  await page.goto("/");
  await expect(page.getByRole("link", { name: /선우 내 결과 자세히 보기/ })).toHaveAttribute(
    "href",
    "/result/STORYFRI",
  );
  await page.goto("/my/compatibilities");
  await expect(page.getByText("곰인형 선우", { exact: true })).toBeVisible();
  await page.goto("/my/results");
  await page.getByRole("button", { name: /선우 삭제/ }).click();
  await page.getByRole("button", { name: "취소", exact: true }).click();
  await expect(page.getByRole("button", { name: /선우 삭제/ })).toBeVisible();
  await page.getByRole("button", { name: /선우 삭제/ }).click();
  await page.getByRole("button", { name: "삭제하기", exact: true }).click();
  await expect(page.getByRole("button", { name: /선우 삭제/ })).toHaveCount(0);
  await page.evaluate(() => sessionStorage.setItem("auth_return_to", "/my/results"));
  await page.goto("/auth/complete");
  await page.waitForURL("**/my/results");
  await expect(page.getByRole("button", { name: /선우 삭제/ })).toHaveCount(0);
  await page.getByRole("button", { name: /지은 삭제/ }).click();
  await page.getByRole("button", { name: "삭제하기", exact: true }).click();
  await expect(page.getByText("보관된 결과가 없어요", { exact: true })).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("link", { name: /내 결과 자세히 보기/ })).toHaveCount(0);
  await page.goto("/result/STORYFRI");
  await expect(page.getByText("결과를 불러오지 못했어요")).toHaveCount(0);
});

test("대표 결과는 오래된 브라우저 값보다 우선하며 초대·추가 케미에도 동일하게 적용된다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("pakit-auth-mock-session", "1");
    localStorage.setItem("pakit-auth-mock-linked", JSON.stringify(["STORYMIN", "STORYFRI"]));
    localStorage.setItem("pakit-auth-mock-primary", "STORYFRI");
    localStorage.setItem(
      "pakit-result-code",
      JSON.stringify({ state: { resultCode: "STORYMIN" }, version: 0 }),
    );
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedText = text;
        },
      },
    });
  });
  await page.goto("/my/compatibilities");
  await expect(page.getByText("곰인형 선우", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "결과 바꾸기" })).toHaveCount(0);
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "친구와의 케미 1" })).toBeVisible();
  await page.screenshot({ path: "/tmp/pakit-primary-chemi.png", fullPage: true });
  await page.goto("/?friend=STORYMIN");
  await expect(page).toHaveURL("/compatibility?mine=STORYFRI&friend=STORYMIN");
  await page.getByRole("button", { name: "새 친구와 케미 보기", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.copiedText)).toContain("friend=STORYFRI");
  await page.goto("/result/STORYMIN");
  await page.getByRole("button", { name: "친구에게 케미 테스트 공유하기", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "친구에게 보낼 문구" })).toHaveValue(
    /friend=STORYFRI/,
  );
  await page.getByRole("button", { name: "링크만 복사하기", exact: true }).click();
  await page.goto("/result/STORYMIN?friend=STORYMIN");
  await page.getByRole("button", { name: "지은님과 케미 보기", exact: true }).click();
  await expect(page).toHaveURL("/compatibility?mine=STORYFRI&friend=STORYMIN");
});
