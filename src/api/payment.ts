import axios from "axios";
import { apiClient } from "@/api/client";
import type { ErrorResponse } from "@/types/common";
import type {
  KakaoPayReadyInput,
  KakaoPayReadyOutput,
  PaymentOrder,
  MyPaymentOrdersOutput,
  RomanticReportOutput,
} from "@/types/payment";

interface ResultSyncOutput {
  synced: string[];
  already_synced: string[];
  rejected: string[];
}

const PAYMENT_RESULT_ERROR_CODES = new Set([
  "PAYMENT_MINE_RESULT_NOT_FOUND",
  "PAYMENT_PARTNER_RESULT_NOT_FOUND",
  "PAYMENT_MINE_RESULT_RETEST_REQUIRED",
  "PAYMENT_PARTNER_RESULT_RETEST_REQUIRED",
]);

export function getPaymentResultErrorMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const detail = (error.response?.data as ErrorResponse | undefined)?.error;
  return detail && PAYMENT_RESULT_ERROR_CODES.has(detail.code) ? detail.message : null;
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

export async function getMyPayments(): Promise<MyPaymentOrdersOutput> {
  const response = await apiClient.get<MyPaymentOrdersOutput>("/api/payments/kakaopay");
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
