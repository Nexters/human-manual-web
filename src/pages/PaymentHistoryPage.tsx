import KakaoLoginButton from "@/components/auth/KakaoLoginButton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { isUnauthorized } from "@/api/auth";
import { getMyPayments } from "@/api/payment";
import Button from "@/components/shared/Button";
import { accountQueryKey, useAuth } from "@/hooks/useAuth";
import { startKakaoLogin } from "@/lib/auth";
import { useCompatibility } from "@/hooks/useCompatibility";
import type { MyPaymentOrder } from "@/types/payment";

function PurchaseParticipants({ order }: { order: MyPaymentOrder }) {
  const pair = useCompatibility(order.mine_result_code, order.partner_result_code);
  return (
    <div className="pakit-premium-people">
      <div className="pakit-premium-pair">
        {[
          {
            label: "나",
            person: pair.data?.mine,
            gender: order.mine_gender,
          },
          {
            label: "상대",
            person: pair.data?.friend,
            gender: order.partner_gender,
          },
        ].map(({ label, person, gender }) => (
          <div key={label} className="pakit-premium-person">
            <div className="pakit-premium-avatar">
              {person?.image_url ? (
                <img src={person.image_url} alt="" />
              ) : (
                <span aria-hidden="true">?</span>
              )}
            </div>
            <p className="pakit-premium-person-label">
              <span>{label}</span>
              <span aria-hidden="true"> · </span>
              <span>{gender || "성별 정보 없음"}</span>
            </p>
            <p className="pakit-premium-name">
              {person?.nickname || (pair.isPending ? "불러오는 중…" : "이름 정보 없음")}
            </p>
          </div>
        ))}
        <span className="pakit-premium-connection" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.4 5.6a5.2 5.2 0 0 0-7.4 0L12 6.7l-1-1.1a5.2 5.2 0 0 0-7.4 7.4L12 21l8.4-8a5.2 5.2 0 0 0 0-7.4Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
      {pair.isError && (
        <button className="mt-2 text-xs text-gray-06 underline" onClick={() => void pair.refetch()}>
          닉네임 다시 불러오기
        </button>
      )}
    </div>
  );
}

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const amountFormat = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
});

export default function PaymentHistoryPage({
  kind = "payments",
}: {
  kind?: "payments" | "premium";
}) {
  const premium = kind === "premium";
  const auth = useAuth();
  const payments = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "payments"],
    queryFn: getMyPayments,
    enabled: Boolean(auth.data),
    retry: false,
  });
  const loginRequired =
    (!auth.isPending && !auth.isError && !auth.data) || isUnauthorized(payments.error);

  return (
    <section
      className={`pakit-account${premium ? " pakit-premium" : ""}`}
      aria-labelledby="payment-history-title"
    >
      <p className="pakit-kicker">마이페이지</p>
      <h1 id="payment-history-title">{premium ? "프리미엄 결과" : "결제 내역"}</h1>
      <p className="pakit-support-description">
        {premium
          ? "구매한 리포트는 언제든 다시 볼 수 있어요."
          : "결제 완료된 주문을 최신순으로 확인할 수 있어요."}
      </p>
      {loginRequired ? (
        <div className="pakit-account-gate">
          <p>
            {premium
              ? "로그인하면 구매한 프리미엄 결과를 확인할 수 있어요."
              : "로그인하면 결제 내역을 확인할 수 있어요."}
          </p>
          <KakaoLoginButton onClick={startKakaoLogin} />
        </div>
      ) : auth.isError || payments.isError ? (
        <div className="pakit-account-gate" role="alert">
          <p>
            {premium ? "프리미엄 결과를" : "결제 내역을"} 불러오지 못했어요. 잠시 후 다시 시도해
            주세요.
          </p>
          <Button onClick={() => void (auth.isError ? auth.refetch() : payments.refetch())}>
            다시 시도
          </Button>
        </div>
      ) : auth.isPending || payments.isPending ? (
        <p className="py-10 text-center text-sm text-gray-06" role="status">
          {premium ? "프리미엄 결과를" : "결제 내역을"} 불러오는 중이에요.
        </p>
      ) : payments.data.items.length === 0 ? (
        <div className="pakit-account-empty">
          <p className="font-bold text-gray-09">
            {premium ? "아직 구매한 결과가 없어요." : "아직 결제 내역이 없어요."}
          </p>
          <p className="mt-3 leading-relaxed">
            테스트 후 유료 분석을 구매하면
            <br />
            이곳에서 {premium ? "구매한 결과를" : "결제 정보를"} 확인할 수 있어요.
          </p>
          <Link to="/?start=1" className="pakit-start-link">
            테스트 시작하기
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-7 text-sm text-gray-06">
            총 {payments.data.total.toLocaleString("ko-KR")}건
          </p>
          <ul
            className="pakit-payment-list"
            aria-label={premium ? "구매한 프리미엄 결과" : "결제 완료 주문"}
          >
            {payments.data.items.map((order) => {
              const paidAt = order.approved_at ?? order.created_at;
              return (
                <li
                  key={order.order_id}
                  className={`pakit-payment-card${premium ? " pakit-premium-card" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={premium ? "pakit-premium-status" : "pakit-payment-badge"}>
                      {premium && (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="m3 8 3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {premium ? "구매 완료" : "결제 완료"}
                    </span>
                    <time dateTime={paidAt} className="text-xs text-gray-06">
                      {dateFormat.format(new Date(paidAt))}
                    </time>
                  </div>
                  <h2
                    className={
                      premium ? "pakit-premium-product" : "mt-5 text-base font-bold break-keep"
                    }
                  >
                    {order.product_name}
                  </h2>
                  {premium ? (
                    <>
                      <PurchaseParticipants order={order} />
                      <Link
                        className="pakit-premium-open"
                        to={`/my/premium/${encodeURIComponent(order.order_id)}`}
                      >
                        {order.fulfillment_reference ? "리포트 다시 보기" : "설명서 만들기"}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14m-5-5 5 5-5 5" />
                        </svg>
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-xl font-bold" aria-label="결제 금액">
                        {amountFormat.format(order.amount)}
                      </p>
                      <dl className="pakit-payment-details">
                        <div>
                          <dt>결제 수단</dt>
                          <dd>카카오페이</dd>
                        </div>
                        <div>
                          <dt>주문번호</dt>
                          <dd className="break-all select-text">{order.order_id}</dd>
                        </div>
                      </dl>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
      <div className="pakit-payment-help">
        <Link to="/support">결제 관련 문의하기</Link>
        <Link to="/refund-policy">취소·환불 정책</Link>
      </div>
    </section>
  );
}
