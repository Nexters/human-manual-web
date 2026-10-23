import type { ButtonHTMLAttributes } from "react";
import kakaoSymbol from "@/assets/svgs/auth/kakao-symbol.svg";
import { cn } from "@/lib/cn";
import "./KakaoLoginButton.css";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  inline?: boolean;
};

/** https://developers.kakao.com/docs/ko/kakaologin/design-guide */
export default function KakaoLoginButton({ className, inline = false, ...props }: Props) {
  return (
    <button
      type="button"
      className={cn("pakit-kakao-login", inline && "pakit-kakao-login-inline", className)}
      {...props}
    >
      <img src={kakaoSymbol} alt="" width="20" height="20" />
      <span>카카오 로그인</span>
    </button>
  );
}
