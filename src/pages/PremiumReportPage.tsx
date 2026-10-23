import KakaoLoginButton from "@/components/auth/KakaoLoginButton";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isUnauthorized } from "@/api/auth";
import { getCompatibility } from "@/api/compatibility";
import { generatePaidRomanticReport, getMyPayments } from "@/api/payment";
import ReportLoading from "@/components/relationshipReport/ReportLoading";
import ReportView from "@/components/relationshipReport/ReportView";
import { parseReport } from "@/components/relationshipReport/parseReport";
import Button from "@/components/shared/Button";
import TopBar from "@/components/shared/TopBar";
import { accountQueryKey, useAuth } from "@/hooks/useAuth";
import { startKakaoLogin } from "@/lib/auth";

export default function PremiumReportPage() {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const result = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "premium-report", orderId],
    queryFn: async () => {
      // 서버가 보관한 구매 대상 코드로 복원하므로 브라우저의 결제 세션이 없어도 열린다.
      const payments = await getMyPayments();
      const order = payments.items.find((item) => item.order_id === orderId);
      if (!order) throw new Error("구매한 결과를 찾을 수 없어요.");
      const [pair, report] = await Promise.all([
        getCompatibility(order.mine_result_code, order.partner_result_code),
        generatePaidRomanticReport(orderId),
      ]);
      return { pair, report: parseReport(report.content) };
    },
    enabled: Boolean(auth.data) && Boolean(orderId),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const loginRequired =
    (!auth.isPending && !auth.isError && !auth.data) || isUnauthorized(result.error);

  return (
    <div className="min-h-dvh bg-[#f8f9fc]">
      <TopBar title="프리미엄 결과" onBack={() => navigate("/my/premium")} />
      {loginRequired ? (
        <div className="pakit-account">
          <div className="pakit-account-gate">
            <p>로그인하면 구매한 프리미엄 결과를 확인할 수 있어요.</p>
            <KakaoLoginButton onClick={startKakaoLogin} />
          </div>
        </div>
      ) : auth.isError || result.isError ? (
        <div className="pakit-account">
          <div className="pakit-account-gate" role="alert">
            <p>구매한 결과를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
            <p className="text-xs text-gray-06 break-all">주문번호 {orderId}</p>
            <Button onClick={() => void (auth.isError ? auth.refetch() : result.refetch())}>
              다시 시도
            </Button>
            <Link to="/support">결제 관련 문의하기</Link>
          </div>
        </div>
      ) : auth.isPending || result.isPending ? (
        <div role="status" aria-label="프리미엄 결과를 불러오는 중이에요">
          <ReportLoading />
        </div>
      ) : (
        <ReportView
          report={result.data.report}
          mine={result.data.pair.mine}
          friend={result.data.pair.friend}
          footer={
            <div className="px-5 pb-10">
              <Link to="/my/premium" className="pakit-start-link">
                프리미엄 결과 목록으로
              </Link>
            </div>
          }
        />
      )}
    </div>
  );
}
