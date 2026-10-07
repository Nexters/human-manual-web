import { apiClient } from "@/api/client";
import type {
  KakaoPayReadyInput,
  KakaoPayReadyOutput,
  PaymentOrder,
  RomanticReportOutput,
} from "@/types/payment";

interface ResultSyncOutput {
  synced: string[];
  already_synced: string[];
  rejected: string[];
}

export async function syncMyResult(resultCode: string): Promise<ResultSyncOutput> {
  const response = await apiClient.post<ResultSyncOutput>("/api/auth/me/results/sync", {
    result_codes: [resultCode],
  });
  return response.data;
}

export async function prepareKakaoPayPayment(
  input: KakaoPayReadyInput,
): Promise<KakaoPayReadyOutput> {
  const response = await apiClient.post<KakaoPayReadyOutput>("/api/payments/kakaopay/ready", input);
  return response.data;
}

export async function getPaymentOrder(orderId: string): Promise<PaymentOrder> {
  const response = await apiClient.get<PaymentOrder>(
    `/api/payments/kakaopay/${encodeURIComponent(orderId)}`,
  );
  return response.data;
}

export async function generatePaidRomanticReport(orderId: string): Promise<RomanticReportOutput> {
  const response = await apiClient.post<RomanticReportOutput>(
    `/api/relationship-reports/romantic/orders/${encodeURIComponent(orderId)}`,
    undefined,
    { timeout: 180_000 },
  );
  return response.data;
}

export function startKakaoLogin(returnTo: string): void {
  const apiOrigin = new URL(
    apiClient.defaults.baseURL ?? window.location.origin,
    window.location.origin,
  );
  const loginUrl = new URL("/api/auth/kakao/login", apiOrigin);
  loginUrl.searchParams.set("return_to", returnTo);
  window.location.assign(loginUrl);
}

export function selectKakaoPayRedirectUrl(payment: KakaoPayReadyOutput): string {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
  return isMobile ? payment.redirect_url.mobile : payment.redirect_url.pc;
}
