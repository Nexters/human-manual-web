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
  await expect(page.getByRole("button", { name: "이미 테스트 했다면?" })).toBeVisible();
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

test("초대 미리보기에서 친구 결과지를 구경한 뒤 테스트해도 초대 맥락을 유지한다", async ({
  page,
}) => {
  await page.goto("/?friend=STORYFRI");
  await page.getByRole("button", { name: "선우님 결과지 보기", exact: true }).click();
  await expect(page).toHaveURL("/result/STORYFRI?friend=STORYFRI");
  const start = page.getByRole("button", { name: "선우님과 케미 보기", exact: true });
  await expect(start).toBeVisible();
  await expect(
    page.getByRole("button", { name: "친구에게 케미 테스트 공유하기", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: /결과지 공유/ })).toHaveCount(0);
  await start.click();
  await expect(
    page.getByRole("button", { name: "이미 테스트했다면? 로그인하고 바로 보기", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "새로 테스트하기", exact: true }).click();
  await expect(page).toHaveURL("/?friend=STORYFRI&start=1");
  await expect(page.getByText("선우님이 함께 케미를 보고 싶어 해요")).toHaveCount(0);
});

test("초대한 친구의 결과지에서는 저장된 내 결과와 친구의 케미를 조회한다", async ({ page }) => {
  await seedMine(page);
  await page.goto("/result/STORYFRI?friend=STORYFRI");
  await page.getByRole("button", { name: "선우님과 케미 보기", exact: true }).click();
  await expect(page).toHaveURL("/compatibility?mine=STORYMIN&friend=STORYFRI");
});

test("내 초대 링크로 내 결과지를 보면 자기 자신과의 케미 버튼을 보여주지 않는다", async ({
  page,
}) => {
  await seedMine(page);
  await page.goto("/result/STORYMIN?friend=STORYMIN");
  await expect(
    page.getByRole("button", { name: "친구에게 케미 테스트 공유하기", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "지은님과 케미 보기", exact: true })).toHaveCount(
    0,
  );
});

test("초대받아 테스트를 마친 내 결과지에서는 기존 케미 확인을 유지한다", async ({ page }) => {
  await seedMine(page);
  await page.goto("/result/STORYMIN?friend=STORYFRI");
  await page.getByRole("button", { name: "선우님과 케미 바로 확인", exact: true }).click();
  await expect(page).toHaveURL("/compatibility?mine=STORYMIN&friend=STORYFRI");
});

test("이미 테스트했다면 로그인 후 다른 기기에 보관한 결과로 바로 케미를 연다", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("pakit-auth-mock-linked", JSON.stringify(["STORYMIN"]));
  });
  await page.goto("/?friend=STORYFRI");
  await page.getByRole("button", { name: "이미 테스트 했다면?", exact: true }).click();
  await expect(page).toHaveURL("/compatibility?mine=STORYMIN&friend=STORYFRI");
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("pakit-result-code") || "null")?.state.resultCode,
      ),
    )
    .toBe("STORYMIN");
});

test("로그인해도 보관된 결과가 없으면 초대를 유지하며 테스트를 안내한다", async ({ page }) => {
  await page.goto("/?friend=STORYFRI");
  await page.getByRole("button", { name: "이미 테스트 했다면?", exact: true }).click();
  await expect(page).toHaveURL("/?friend=STORYFRI&restore=1");
  await expect(
    page.getByRole("status").filter({ hasText: "계정에 보관된 결과가 없어요." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "테스트하고 케미 보기", exact: true }).click();
  await expect(page).toHaveURL(/friend=STORYFRI/);
});

test("이미 로그인한 사용자는 로컬 결과가 없어도 계정 결과로 케미를 연다", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("pakit-auth-mock-session", "1");
    localStorage.setItem("pakit-auth-mock-linked", JSON.stringify(["STORYMIN"]));
  });
  await page.goto("/?friend=STORYFRI");
  await expect(page).toHaveURL("/compatibility?mine=STORYMIN&friend=STORYFRI");
});

test("친구 결과지의 케미 보기 팝업에서 로그인해 보관한 결과로 바로 본다", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("pakit-auth-mock-linked", JSON.stringify(["STORYMIN"]));
  });
  await page.goto("/result/STORYFRI?friend=STORYFRI");
  await page.getByRole("button", { name: "선우님과 케미 보기", exact: true }).click();
  await page
    .getByRole("button", { name: "이미 테스트했다면? 로그인하고 바로 보기", exact: true })
    .click();
  await expect(page).toHaveURL("/compatibility?mine=STORYMIN&friend=STORYFRI");
});

test("케미 이력이 없는 내 결과에도 빈 관계 진열장과 초대 팝업을 보여준다", async ({ page }) => {
  await seedMine(page);
  await page.goto("/result/STORYMIN");
  await expect(page.getByText("지은님의 관계 진열장", { exact: true })).toBeVisible();
  await expect(
    page.getByText("친구와 케미를 보면 이곳에 하나씩 모여요", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "친구에게 케미 테스트 공유하기", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "친구에게 보낼 문구" })).toHaveValue(
    /friend=STORYMIN/,
  );
});

test("초대한 친구의 빈 진열장에서는 그 친구와 케미를 보는 흐름으로 연결한다", async ({ page }) => {
  await page.goto("/result/STORYFRI?friend=STORYFRI");
  await page.getByRole("button", { name: "선우님과 케미 보기", exact: true }).click();
  await expect(page.getByRole("button", { name: "새로 테스트하기", exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "이미 테스트했다면? 로그인하고 바로 보기", exact: true }),
  ).toBeVisible();
});
