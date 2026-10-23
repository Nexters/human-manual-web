import { AxiosError, AxiosHeaders } from "axios";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import type { AccountResult } from "@/api/auth";
import { apiClient } from "@/api/client";
import { MOCK_SESSION_KEY } from "@/lib/authMockMode";
import { mockAssessmentResult } from "./assessmentResult";
import { mockCompatibility } from "./compatibility";

const LINKED_KEY = "pakit-auth-mock-linked";
const PRIMARY_KEY = "pakit-auth-mock-primary";
const DELETED_KEY = "pakit-auth-mock-deleted";
const visibleCodes = () =>
  linkedCodes().filter((code) => !readStored<string[]>(DELETED_KEY, []).includes(code));
const SUBMISSIONS_KEY = "pakit-auth-mock-submissions";
const SCENARIO_KEY = "pakit-auth-mock-scenario";
const CREATED_AT = "2026-09-01T09:30:00Z";

type StoredSubmission = { result_code: string; nickname: string };
function readStored<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
const submissions = () => readStored<StoredSubmission[]>(SUBMISSIONS_KEY, []);
const linkedCodes = () => readStored<string[]>(LINKED_KEY, []);
const isLoggedIn = () => sessionStorage.getItem(MOCK_SESSION_KEY) === "1";

function findResult(code: string): AccountResult | null {
  const saved = submissions().find((item) => item.result_code === code);
  if (!saved && code !== "STORYMIN" && code !== "STORYFRI") return null;
  const friend = code === "STORYFRI";
  const person = friend ? mockCompatibility.friend : mockCompatibility.mine;
  return {
    result_code: code,
    nickname: saved?.nickname ?? person.nickname,
    result_name: friend ? "곰인형 선우" : mockAssessmentResult.overview.result_name,
    noun: person.noun,
    character_id: person.character_id,
    image_url: person.image_url,
    created_at: CREATED_AT,
  };
}
function respond(config: InternalAxiosRequestConfig, status: number, data: unknown) {
  const response = {
    config,
    status,
    data,
    statusText: String(status),
    headers: new AxiosHeaders(),
  };
  if (status >= 400)
    throw new AxiosError(`Mock API ${status}`, "ERR_BAD_RESPONSE", config, undefined, response);
  return response;
}

/** 전체 API를 로컬 fixture로 응답한다. 알 수 없는 API도 운영 서버로 넘기지 않는다. */
const adapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const url = new URL(config.url || "/", window.location.origin);
  const path = url.pathname;
  const method = config.method?.toUpperCase() || "GET";
  const scenario = sessionStorage.getItem(SCENARIO_KEY);
  const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
  const ok = (data: unknown, status = 200) => respond(config, status, data);
  const fail = (status: number, data?: unknown) =>
    respond(config, status, data ?? { error: { code: `MOCK_${status}` } });

  if (path.startsWith("/api/auth/")) {
    if (!config.withCredentials) return fail(401);
    if (path === "/api/auth/me") {
      if (
        !isLoggedIn() ||
        (scenario === "login-failure" && window.location.pathname === "/auth/complete")
      )
        return fail(401);
      return ok({ user_id: 1, created_at: CREATED_AT });
    }
    if (!isLoggedIn()) return fail(401);
    if (path === "/api/auth/logout" && method === "POST") {
      if (scenario === "logout-failure") return fail(500);
      sessionStorage.removeItem(MOCK_SESSION_KEY);
      return ok(undefined, 204);
    }
    if (path === "/api/auth/me/results/sync" && method === "POST") {
      if (scenario === "sync-failure") return fail(500);
      const linked = new Set(linkedCodes());
      const result = {
        synced: [] as string[],
        already_synced: [] as string[],
        rejected: [] as string[],
      };
      for (const code of new Set<string>(body?.result_codes ?? [])) {
        if (!findResult(code)) result.rejected.push(code);
        else if (linked.has(code)) result.already_synced.push(code);
        else {
          linked.add(code);
          result.synced.push(code);
        }
      }
      localStorage.setItem(LINKED_KEY, JSON.stringify([...linked]));
      return ok(result);
    }
    const resultAction = path.match(/^\/api\/auth\/me\/results\/([^/]+)(\/primary)?$/);
    if (resultAction && (method === "PUT" || method === "DELETE")) {
      const code = decodeURIComponent(resultAction[1]);
      if (!visibleCodes().includes(code)) return fail(404);
      if (method === "PUT" && resultAction[2]) localStorage.setItem(PRIMARY_KEY, code);
      else if (method === "DELETE" && !resultAction[2]) {
        localStorage.setItem(
          DELETED_KEY,
          JSON.stringify([...readStored<string[]>(DELETED_KEY, []), code]),
        );
        if (localStorage.getItem(PRIMARY_KEY) === code) localStorage.removeItem(PRIMARY_KEY);
      } else return fail(404);
      return ok(undefined, 204);
    }
    if (path === "/api/auth/me/results") {
      const primary = localStorage.getItem(PRIMARY_KEY);
      const items = visibleCodes()
        .sort((a, b) => Number(b === primary) - Number(a === primary))
        .map(findResult)
        .filter((item) => item !== null);
      return ok({ total: items.length, items });
    }
    if (path === "/api/auth/me/compatibilities") {
      const mine = visibleCodes().includes("STORYMIN") ? findResult("STORYMIN") : null;
      const items = mine
        ? [{ mine, friend: findResult("STORYFRI"), score: 82, tested_at: CREATED_AT }]
        : [];
      return ok({ total: items.length, items });
    }
    return fail(404);
  }
  if (path === "/api/tests/submissions/count") return ok({ completed_count: 1234 });
  if (path === "/api/tests/submissions" && method === "POST") {
    const code = `M${String(submissions().length + 1).padStart(7, "0")}`;
    const nickname = body?.participant?.nickname || "로컬 테스트";
    localStorage.setItem(
      SUBMISSIONS_KEY,
      JSON.stringify([...submissions(), { result_code: code, nickname }]),
    );
    if (isLoggedIn() && config.withCredentials)
      localStorage.setItem(LINKED_KEY, JSON.stringify([...new Set([...linkedCodes(), code])]));
    return ok({ ...mockAssessmentResult, result_code: code, participant: { nickname } }, 201);
  }
  if (path.startsWith("/api/results/")) {
    const code = decodeURIComponent(path.split("/")[3]);
    const result = findResult(code);
    if (!result) return fail(404);
    if (path.endsWith("/compatibility-ranking"))
      return ok({ result_code: code, total: 0, rankings: [] });
    return ok({
      ...mockAssessmentResult,
      result_code: code,
      participant: { nickname: result.nickname },
      overview: { ...mockAssessmentResult.overview, ...result },
    });
  }
  if (path === "/api/compatibility") {
    const mine = findResult(config.params?.mine ?? url.searchParams.get("mine") ?? "");
    const friend = findResult(config.params?.friend ?? url.searchParams.get("friend") ?? "");
    return mine && friend ? ok({ ...mockCompatibility, mine, friend }) : fail(404);
  }
  if (path === "/api/payments/kakaopay" && method === "GET") {
    if (!isLoggedIn() || !config.withCredentials || scenario === "payments-expired")
      return fail(401);
    if (scenario === "payments-failure") return fail(500);
    const items =
      scenario === "payments-empty"
        ? []
        : [
            {
              order_id: "PKT-1019-87MS",
              product_code: "ROMANTIC_REPORT",
              product_name: "연인 관계 설명서",
              status: "APPROVED",
              amount: 990,
              currency: "KRW",
              fulfillment_reference: "REPORT01",
              created_at: "2026-10-18T15:29:00Z",
              approved_at: "2026-10-18T15:30:00Z",
              mine_result_code: "STORYMIN",
              partner_result_code: "STORYFRI",
              mine_gender: "여자",
              partner_gender: "남자",
            },
            {
              order_id: "PKT-1012-42AB",
              product_code: "ROMANTIC_REPORT",
              product_name: "연인 관계 설명서",
              status: "APPROVED",
              amount: 990,
              currency: "KRW",
              fulfillment_reference: null,
              created_at: "2026-10-12T03:00:00Z",
              approved_at: "2026-10-12T03:01:00Z",
              mine_result_code: "STORYMIN",
              partner_result_code: "STORYFRI",
              mine_gender: "여자",
              partner_gender: "남자",
            },
          ];
    return ok({ total: items.length, items });
  }
  if (path === "/api/payments/kakaopay/ready" && method === "POST") {
    if (scenario === "payment-mine-retest") {
      return fail(409, {
        error: {
          code: "PAYMENT_MINE_RESULT_RETEST_REQUIRED",
          message:
            "내 결과는 이전 버전이라 유료 분석에 사용할 수 없습니다. 새 테스트를 진행해주세요.",
        },
      });
    }
    return fail(500);
  }
  if (path.startsWith("/api/relationship-reports/romantic/orders/") && method === "POST") {
    if (!isLoggedIn() || !config.withCredentials) return fail(401);
    if (scenario === "premium-failure") return fail(502);
    return ok({
      report_code: "REPORT01",
      content:
        "## 1. 두 사람의 관계\n서로 다른 속도를 이해하는 두 사람이에요.\n\n## 10. 한 줄 요약\n함께 맞춰가는 우리만의 리듬",
      created_at: CREATED_AT,
    });
  }
  return fail(404);
};

export function installAuthMock() {
  apiClient.defaults.adapter = adapter;
}
