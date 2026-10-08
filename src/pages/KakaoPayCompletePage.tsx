import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import Typography from "@/components/shared/Typography";
import ReportView from "@/components/relationshipReport/ReportView";
import ReportLoading from "@/components/relationshipReport/ReportLoading";
import { parseReport } from "@/components/relationshipReport/parseReport";
import { generatePaidRomanticReport, getPaymentOrder } from "@/api/payment";
import { useCompatibility } from "@/hooks/useCompatibility";
import { getPaymentFlowContext } from "@/lib/paymentFlow";
import type { RomanticReportOutput } from "@/types/payment";
import tokkiImage from "@/assets/img/relationshipReport/tokki.png";

type ViewState = "loading" | "success" | "canceled" | "failed";

export default function KakaoPayCompletePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";
  const redirectStatus = searchParams.get("status");
  const started = useRef(false);
  const [flowContext] = useState(() => getPaymentFlowContext(orderId));
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
  const [report, setReport] = useState<RomanticReportOutput | null>(null);
  const { data: pair, isError: isPairError } = useCompatibility(
    flowContext?.mine ?? "",
    flowContext?.friend ?? "",
  );
  const parsed = useMemo(() => (report ? parseReport(report.content) : null), [report]);

  useEffect(() => {
    if (state === "success" && parsed) window.scrollTo({ top: 0, behavior: "instant" });
  }, [parsed, state]);

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
        return generatePaidRomanticReport(orderId);
      })
      .then((generated) => {
        if (!generated) return;
        setReport(generated);
        setState("success");
      })
      .catch(() => {
        setFailureMessage("결제 확인 또는 설명서 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
        setState("failed");
      });
  }, [orderId, redirectStatus]);

  const topBar = <TopBar title="연인 관계 설명서" className="bg-[#f8f9fc]/95 backdrop-blur" />;

  if (state === "loading" || (state === "success" && flowContext && !pair && !isPairError)) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <ReportLoading mine={pair?.mine} friend={pair?.friend} />
      </div>
    );
  }

  if (state === "success" && report && parsed && pair) {
    return (
      <div className="flex min-h-dvh flex-col bg-[#f8f9fc]">
        {topBar}
        <ReportView
          report={parsed}
          mine={pair.mine}
          friend={pair.friend}
          footer={
            <div className="flex flex-col gap-[18px] px-4 pt-9 pb-9">
              <p className="text-gray-06 text-center text-[12px]">
                두 사람의 답을 바탕으로 만든 맞춤형 리포트
              </p>
              <img
                src={tokkiImage}
                alt=""
                className="mx-auto -mb-2 h-[58px] w-[52px] object-contain opacity-90"
              />
              <p className="text-gray-05 text-center text-[12px] leading-[1.5] break-keep">
                AI가 두 사람의 응답을 바탕으로 쓴 설명서예요.
                <br />
                같은 두 사람이라도 만들 때마다 표현이 조금씩 달라질 수 있어요.
              </p>
              <Link
                to={`/result/${encodeURIComponent(flowContext!.mine)}`}
                className="bg-main flex h-14 items-center justify-center rounded-[16px] text-white shadow-[0_10px_24px_rgba(1,49,255,0.22)]"
              >
                <Typography variant="sb4" as="span">
                  내 결과지로 돌아가기
                </Typography>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const canceled = state === "canceled";
  const missingDisplayContext = state === "success" && (!flowContext || !pair || !parsed);
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <TopBar title="결제 결과" />
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
        <Typography variant="h2" className="text-gray-09">
          {canceled
            ? "결제가 취소됐어요"
            : missingDisplayContext
              ? "결제는 완료됐지만 설명서를 표시하지 못했어요"
              : "결제를 완료하지 못했어요"}
        </Typography>
        <Typography variant="me2" className="text-gray-06 break-keep">
          {canceled
            ? "결제된 금액은 없어요."
            : missingDisplayContext
              ? "고객센터로 주문번호를 알려주시면 확인해드릴게요."
              : failureMessage}
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
