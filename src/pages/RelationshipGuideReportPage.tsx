import { useEffect, useMemo, type ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import TopBar from "@/components/shared/TopBar";
import Typography from "@/components/shared/Typography";
import ReportView from "@/components/relationshipReport/ReportView";
import ReportLoading from "@/components/relationshipReport/ReportLoading";
import { parseReport } from "@/components/relationshipReport/parseReport";
import { reportPaths, type ReportStepState } from "@/components/relationshipReport/reportFlow";
import { useCompatibility } from "@/hooks/useCompatibility";
import { createRomanticReport } from "@/api/relationshipReport";
import tokkiImage from "@/assets/img/relationshipReport/tokki.png";
import { takeResultCode } from "@/lib/resultCode";

// 상태 코드별 안내. 403 은 관리자 비밀번호(베타 코드)가 틀린 경우다.
const ERROR_MESSAGES: Record<number, string> = {
  403: "관리자 비밀번호가 맞지 않아요",
  404: "결과 코드를 찾을 수 없어요",
  409: "예전 테스트 결과라 설명서를 만들 수 없어요",
};

function MessageView({ message, action }: { message: string; action: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-5 text-center">
      <Typography variant="me2" className="text-gray-07 break-keep">
        {message}
      </Typography>
      {action}
    </div>
  );
}

const actionButton =
  "bg-gray-09 flex h-[48px] cursor-pointer items-center justify-center rounded-[12px] px-6 text-white";

export default function RelationshipGuideReportPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: ReportStepState | null };
  const [searchParams] = useSearchParams();
  const mine = takeResultCode(searchParams.get("mine")) ?? "";
  const friend = takeResultCode(searchParams.get("friend")) ?? "";
  const { data: pair } = useCompatibility(mine, friend);

  const report = useQuery({
    queryKey: ["romanticReport", mine, friend, state?.mineGender, state?.partnerGender],
    queryFn: () =>
      createRomanticReport(
        {
          mine_result_code: mine,
          partner_result_code: friend,
          mine_gender: state!.mineGender,
          partner_gender: state!.partnerGender,
        },
        state!.betaCode,
      ),
    enabled: Boolean(mine && friend && state),
    // 같은 입력이면 서버가 저장본을 돌려주지만, 화면에 머무는 동안 다시 부를 이유가 없다.
    staleTime: Infinity,
    retry: false,
  });
  const parsed = useMemo(() => report.data && parseReport(report.data.content), [report.data]);

  // 생성을 기다리는 동안 로딩 화면을 내려봤더라도 설명서는 맨 위부터 보여준다.
  useEffect(() => {
    if (parsed) window.scrollTo({ top: 0, behavior: "instant" });
  }, [parsed]);

  const goCheckout = () => navigate(reportPaths.checkout(mine, friend), { replace: true });
  const topBar = (
    <TopBar
      title="연인 관계 설명서"
      onBack={() =>
        navigate(
          `/compatibility?mine=${encodeURIComponent(mine)}&friend=${encodeURIComponent(friend)}`,
        )
      }
      className="bg-[#f8f9fc]/95 backdrop-blur"
    />
  );

  // 베타 코드는 라우터 state 로만 들고 오므로, 새로고침하면 처음부터 다시 진행해야 한다.
  if (!mine || !friend || !state) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <MessageView
          message="설명서 정보가 없어요. 결제 페이지에서 다시 시작해주세요."
          action={
            <button type="button" onClick={goCheckout} className={actionButton}>
              <Typography variant="sb4" as="span">
                결제 페이지로
              </Typography>
            </button>
          }
        />
      </div>
    );
  }

  if (report.isPending || (report.isSuccess && !pair)) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <ReportLoading mine={pair?.mine} friend={pair?.friend} />
      </div>
    );
  }

  if (report.isError || !parsed || !pair) {
    const status = isAxiosError(report.error) ? report.error.response?.status : undefined;
    const known = status ? ERROR_MESSAGES[status] : undefined;
    const message = known ?? "설명서를 만들지 못했어요. 잠시 후 다시 시도해주세요.";
    // 비밀번호·코드 문제는 다시 눌러도 같으니 결제 페이지로, 그 외(AI 생성 실패 등)는 재시도
    const canRetry = !known;
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <MessageView
          message={message}
          action={
            <button
              type="button"
              onClick={canRetry ? () => void report.refetch() : goCheckout}
              className={actionButton}
            >
              <Typography variant="sb4" as="span">
                {canRetry ? "다시 시도" : "결제 페이지로"}
              </Typography>
            </button>
          }
        />
      </div>
    );
  }

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
            <button
              type="button"
              onClick={() => navigate(`/result/${encodeURIComponent(mine)}`)}
              className="bg-main flex h-14 cursor-pointer items-center justify-center rounded-[16px] text-white shadow-[0_10px_24px_rgba(1,49,255,0.22)]"
            >
              <Typography variant="sb4" as="span">
                내 결과지로 돌아가기
              </Typography>
            </button>
          </div>
        }
      />
    </div>
  );
}
