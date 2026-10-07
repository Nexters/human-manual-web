import { useState } from "react";
import axios from "axios";
import {
  prepareKakaoPayPayment,
  selectKakaoPayRedirectUrl,
  startKakaoLogin,
  syncMyResult,
} from "@/api/payment";

interface KakaoPayCheckoutInput {
  mine: string;
  friend: string;
  mineGender: string;
  partnerGender: string;
}

export function useKakaoPayCheckout({
  mine,
  friend,
  mineGender,
  partnerGender,
}: KakaoPayCheckoutInput) {
  const [isPaying, setIsPaying] = useState(false);

  const pay = async () => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      await syncMyResult(mine);
      const payment = await prepareKakaoPayPayment({
        mine_result_code: mine,
        partner_result_code: friend,
        mine_gender: mineGender,
        partner_gender: partnerGender,
      });
      window.location.assign(selectKakaoPayRedirectUrl(payment));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        startKakaoLogin(`${window.location.pathname}${window.location.search}`);
        return;
      }
      setIsPaying(false);
      throw error;
    }
  };

  return { pay, isPaying };
}
