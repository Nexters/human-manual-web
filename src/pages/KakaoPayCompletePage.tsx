import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import Typography from "@/components/shared/Typography";
import ReportLoading from "@/components/relationshipReport/ReportLoading";
import { generatePaidRomanticReport, getPaymentOrder, isReportInProgress } from "@/api/payment";
import { trackMetaEvent } from "@/lib/meta-pixel";

type ViewState = "loading" | "canceled" | "failed";

export default function KakaoPayCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";
  const redirectStatus = searchParams.get("status");
  const started = useRef(false);
  const [state, setState] = useState<ViewState>(
    redirectStatus === "canceled"
      ? "canceled"
      : redirectStatus === "failed" || !orderId
        ? "failed"
        : "loading",
  );
  const [failureMessage, setFailureMessage] = useState(
    orderId
      ? "결제 승인 상태를 확인하지 못했어요. 잠시 후 다시 시도해주세요."
      : "주문 정보를 찾을 수 없어요. 결제 페이지에서 다시 시도해주세요.",
  );
  useEffect(() => {
    if (redirectStatus === "canceled" || redirectStatus === "failed" || started.current) return;
    if (!orderId) return;

    started.current = true;
    void getPaymentOrder(orderId)
      .then((order) => {
        if (order.status === "CANCELED") {
          setState("canceled");
          return null;
        }
        if (order.status !== "APPROVED") {
          setFailureMessage("카카오페이 결제 승인이 확인되지 않았어요.");
          setState("failed");
          return null;
        }
        // 승인된 주문에서만 보낸다. 금액을 실어야 광고 관리자에서 광고비 대비
        // 매출(ROAS)이 바로 보인다.
        trackMetaEvent("Purchase", {
          value: order.amount,
          currency: order.currency,
          content_name: order.product_name,
        });
        return generatePaidRomanticReport(orderId);
      })
      .then((generated) => {
        if (!generated) return;
        // 결제 콜백 화면은 임시 경로다. 정식 결과 URL로 교체해야 브라우저를
        // 나중에 복원해도 결제 세션이 아닌 저장된 결과를 다시 불러올 수 있다.
        navigate(`/my/premium/${encodeURIComponent(orderId)}`, { replace: true });
      })
      .catch((error: unknown) => {
        if (isReportInProgress(error)) {
          // 새로고침 등으로 먼저 시작된 생성이 아직 돌고 있다. 결과 화면이 기다렸다 받아온다.
          navigate(`/my/premium/${encodeURIComponent(orderId)}`, { replace: true });
          return;
        }
        setFailureMessage("결제 확인 또는 설명서 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
        setState("failed");
      });
  }, [navigate, orderId, redirectStatus]);

  const topBar = <TopBar title="연인 관계 설명서" className="bg-[#f8f9fc]/95 backdrop-blur" />;

  if (state === "loading") {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <ReportLoading />
      </div>
    );
  }

  const canceled = state === "canceled";
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <TopBar title="결제 결과" />
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
        <Typography variant="h2" className="text-gray-09">
          {canceled ? "결제가 취소됐어요" : "결제를 완료하지 못했어요"}
        </Typography>
        <Typography variant="me2" className="text-gray-06 break-keep">
          {canceled ? "결제된 금액은 없어요." : failureMessage}
        </Typography>
        {orderId && !canceled && (
          <Typography variant="me4" className="text-gray-04">
            주문번호 {orderId}
          </Typography>
        )}
        <Link to="/" className="rounded-[12px] bg-gray-09 px-5 py-3 text-white">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
