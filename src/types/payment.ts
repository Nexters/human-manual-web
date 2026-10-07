export type PaymentStatus = "CREATED" | "READY" | "APPROVED" | "CANCELED" | "FAILED";

export interface KakaoPayReadyInput {
  mine_result_code: string;
  partner_result_code: string;
  mine_gender: string;
  partner_gender: string;
}

export interface PaymentOrder {
  order_id: string;
  product_code: string;
  product_name: string;
  status: PaymentStatus;
  amount: number;
  currency: "KRW";
  fulfillment_reference: string | null;
  created_at: string;
  approved_at: string | null;
}

export interface KakaoPayReadyOutput extends PaymentOrder {
  redirect_url: {
    app: string;
    mobile: string;
    pc: string;
  };
}

export interface RomanticReportOutput {
  report_code: string;
  content: string;
  created_at: string;
}
