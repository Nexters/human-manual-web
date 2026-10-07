import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import Typography from "@/components/shared/Typography";
import Spinner from "@/components/shared/Spinner";
import { generatePaidRomanticReport } from "@/api/payment";
import type { RomanticReportOutput } from "@/types/payment";

type ViewState = "loading" | "success" | "canceled" | "failed";

export default function KakaoPayCompletePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";
  const paymentStatus = searchParams.get("status");
  const started = useRef(false);
  const [state, setState] = useState<ViewState>(
    paymentStatus === "canceled" ? "canceled" : paymentStatus === "failed" ? "failed" : "loading",
  );
  const [report, setReport] = useState<RomanticReportOutput | null>(null);

  useEffect(() => {
    if (paymentStatus !== "approved" || !orderId || started.current) return;
    started.current = true;
    void generatePaidRomanticReport(orderId)
      .then((generated) => {
        setReport(generated);
        setState("success");
      })
      .catch(() => setState("failed"));
  }, [orderId, paymentStatus]);

  if (state === "loading") {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <TopBar title="관계 설명서" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
          <Spinner />
          <Typography variant="me2" className="text-gray-07">
            결제가 완료됐어요. 맞춤 관계 설명서를 만들고 있어요.
          </Typography>
        </div>
      </div>
    );
  }

  if (state === "success" && report) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <TopBar title="맞춤 관계 설명서" />
        <article className="px-5 py-8">
          <div className="rounded-[20px] bg-[#fff9fc] p-5">
            <div className="text-[16px] leading-[1.8] whitespace-pre-wrap text-gray-08">
              {report.content}
            </div>
          </div>
        </article>
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
        <Typography variant="me2" className="text-gray-06">
          {canceled ? "결제된 금액은 없어요." : "잠시 후 결제 화면에서 다시 시도해주세요."}
        </Typography>
        <Link to="/" className="rounded-[12px] bg-gray-09 px-5 py-3 text-white">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
