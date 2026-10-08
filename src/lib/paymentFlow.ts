interface PaymentFlowContext {
  mine: string;
  friend: string;
}

interface GenderSelection {
  mineGender: string;
  partnerGender: string;
}

const PAYMENT_CONTEXT_PREFIX = "pakit:payment-context:";
const GENDER_SELECTION_PREFIX = "pakit:gender-selection:";

export function savePendingGenderSelection(
  mine: string,
  friend: string,
  selection: GenderSelection,
): void {
  try {
    window.sessionStorage.setItem(
      `${GENDER_SELECTION_PREFIX}${encodeURIComponent(mine)}:${encodeURIComponent(friend)}`,
      JSON.stringify(selection),
    );
  } catch {
    // 로그인 왕복 후 선택값을 복원하지 못해도 다시 선택해서 결제할 수 있다.
  }
}

export function getPendingGenderSelection(mine: string, friend: string): GenderSelection | null {
  try {
    const value = window.sessionStorage.getItem(
      `${GENDER_SELECTION_PREFIX}${encodeURIComponent(mine)}:${encodeURIComponent(friend)}`,
    );
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<GenderSelection>;
    return typeof parsed.mineGender === "string" && typeof parsed.partnerGender === "string"
      ? { mineGender: parsed.mineGender, partnerGender: parsed.partnerGender }
      : null;
  } catch {
    return null;
  }
}

export function savePaymentFlowContext(orderId: string, context: PaymentFlowContext): void {
  try {
    window.sessionStorage.setItem(`${PAYMENT_CONTEXT_PREFIX}${orderId}`, JSON.stringify(context));
  } catch {
    // 결제 승인 자체에는 영향을 주지 않는다. 완료 화면에서 복구 안내를 표시한다.
  }
}

export function getPaymentFlowContext(orderId: string): PaymentFlowContext | null {
  try {
    const value = window.sessionStorage.getItem(`${PAYMENT_CONTEXT_PREFIX}${orderId}`);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<PaymentFlowContext>;
    return typeof parsed.mine === "string" && typeof parsed.friend === "string"
      ? { mine: parsed.mine, friend: parsed.friend }
      : null;
  } catch {
    return null;
  }
}
