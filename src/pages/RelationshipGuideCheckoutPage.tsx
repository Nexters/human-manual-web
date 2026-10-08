import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import Typography from "@/components/shared/Typography";
import { useCompatibility } from "@/hooks/useCompatibility";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { takeResultCode } from "@/lib/resultCode";
import AdminCodeModal from "@/components/relationshipReport/AdminCodeModal";
import { reportPaths, type GenderStepState } from "@/components/relationshipReport/reportFlow";

function LoadingView() {
  return (
    <div className="flex flex-1 items-center justify-center px-5">
      <Typography variant="me2" className="text-gray-06">
        주문 정보를 불러오고 있어요
      </Typography>
    </div>
  );
}

export default function RelationshipGuideCheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mine = takeResultCode(searchParams.get("mine")) ?? "";
  const friend = takeResultCode(searchParams.get("friend")) ?? "";
  const { data, isLoading, isError } = useCompatibility(mine, friend);
  const { open: openToast } = useToast();
  const { open: openModal, close: closeModal } = useModal();
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isImmediateProvisionAgreed, setIsImmediateProvisionAgreed] = useState(false);
  const canPay = isTermsAgreed && isImmediateProvisionAgreed;

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate(
      `/compatibility?mine=${encodeURIComponent(mine)}&friend=${encodeURIComponent(friend)}`,
    );
  };

  const handlePayment = () => {
    openToast("카카오페이 결제 연동을 준비 중이에요");
  };

  // 결제 연동 전 관리자용 우회 입구. 안내 문구를 누르면 열린다.
  const handleAdminTap = () => {
    openModal({
      title: "관리자 확인",
      contents: (
        <AdminCodeModal
          onSubmit={(betaCode) => {
            closeModal();
            const state: GenderStepState = { betaCode };
            navigate(reportPaths.gender(mine, friend), { state });
          }}
        />
      ),
    });
  };

  const topBar = <TopBar title="결제하기" onBack={handleBack} />;

  if (!mine || !friend) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <Typography variant="me2" className="text-gray-07">
            주문 정보를 찾을 수 없어요. 궁합 결과에서 다시 시도해주세요.
          </Typography>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <LoadingView />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <Typography variant="me2" className="text-gray-07">
            주문 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {topBar}

      <div className="flex flex-1 flex-col gap-8 px-5 pt-6 pb-10">
        <section aria-labelledby="order-product-title">
          <Typography id="order-product-title" variant="h2" className="text-gray-09">
            주문 상품
          </Typography>

          <div className="border-gray-02 mt-4 flex items-center justify-between gap-4 rounded-[20px] border bg-[#fff9fc] p-5">
            <div className="min-w-0">
              <Typography variant="h3" className="text-gray-09">
                맞춤 관계 설명서
              </Typography>
              <Typography variant="me3" className="mt-1 text-gray-06 break-keep">
                {data.mine.nickname}님과 {data.friend.nickname}님의 관계 사용법
              </Typography>
              <Typography variant="me4" className="mt-2 leading-[1.5] text-gray-04">
                결제 완료 후 바로 확인 · 계속 열람 가능
              </Typography>
            </div>
            <Typography variant="h3" className="shrink-0 text-gray-09">
              990원
            </Typography>
          </div>
        </section>

        <section aria-labelledby="payment-amount-title">
          <Typography id="payment-amount-title" variant="h2" className="text-gray-09">
            결제 금액
          </Typography>

          <div className="border-gray-02 mt-4 flex items-center justify-between rounded-[20px] border px-5 py-6">
            <Typography variant="me2" className="text-gray-07">
              최종 결제 금액
            </Typography>
            <span className="text-[28px] leading-none font-bold tracking-[-1.12px] text-gray-09">
              990원
            </span>
          </div>
        </section>

        <section aria-labelledby="payment-method-title">
          <Typography id="payment-method-title" variant="h2" className="text-gray-09">
            결제 수단
          </Typography>

          <div className="mt-4 flex items-center justify-between rounded-[18px] border border-[#F2D900] bg-[#FFF9C4] px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 items-center rounded-full bg-[#FEE500] px-2.5 text-[14px] font-extrabold tracking-[-0.56px] text-[#191919]">
                pay
              </span>
              <Typography variant="sb4" className="text-gray-09">
                카카오페이
              </Typography>
            </div>
            <span
              aria-label="선택됨"
              className="flex size-6 items-center justify-center rounded-full bg-gray-09 text-[13px] font-bold text-white"
            >
              ✓
            </span>
          </div>
        </section>

        <section aria-labelledby="agreement-title">
          <Typography id="agreement-title" variant="h2" className="text-gray-09">
            주문 확인
          </Typography>

          <div className="border-gray-02 mt-4 rounded-[16px] border bg-gray-00 px-4 py-4">
            <div className="flex items-start gap-3">
              <input
                id="terms-agreement"
                type="checkbox"
                checked={isTermsAgreed}
                onChange={(event) => setIsTermsAgreed(event.target.checked)}
                className="accent-sub-4 mt-0.5 size-5 shrink-0"
              />
              <label htmlFor="terms-agreement" className="block cursor-pointer">
                <Typography variant="me3" as="span" className="text-gray-07 break-keep">
                  <span className="text-sub-4 mr-1">[필수]</span>위 주문 내용을 확인했으며,
                  이용약관과 취소·환불 정책에 동의합니다.
                </Typography>
              </label>
            </div>

            <div className="border-gray-02 mt-4 flex items-start gap-3 border-t pt-4">
              <input
                id="immediate-provision-agreement"
                type="checkbox"
                checked={isImmediateProvisionAgreed}
                onChange={(event) => setIsImmediateProvisionAgreed(event.target.checked)}
                className="accent-sub-4 mt-0.5 size-5 shrink-0"
              />
              <label htmlFor="immediate-provision-agreement" className="block cursor-pointer">
                <Typography variant="me3" as="span" className="text-gray-07 break-keep">
                  <span className="text-sub-4 mr-1">[필수]</span>결제 완료 즉시 설명서 제공이
                  시작되며, 제공이 시작된 뒤에는 단순 변심에 따른 청약철회가 제한될 수 있음을
                  확인했습니다.
                </Typography>
              </label>
            </div>

            <div className="mt-4 border-t border-gray-02 pt-4">
              <nav aria-label="결제 정책" className="mt-3 flex flex-col gap-2">
                {[
                  ["/terms", "이용약관"],
                  ["/privacy", "개인정보처리방침"],
                  ["/refund-policy", "취소·환불 정책"],
                ].map(([to, label]) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center justify-between text-[12px] leading-[1.5] font-medium tracking-[-0.48px] text-gray-05"
                  >
                    <span>{label}</span>
                    <span className="underline underline-offset-2">자세히 보기 ›</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </section>

        <div className="mt-auto pt-1">
          <button
            type="button"
            disabled={!canPay}
            onClick={handlePayment}
            className="flex h-[58px] w-full items-center justify-center rounded-[14px] bg-[#FEE500] text-[#191919] transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:bg-gray-02 disabled:text-gray-04"
          >
            <Typography variant="h3" as="span">
              990원 카카오페이로 결제하기
            </Typography>
          </button>
          <Typography
            variant="me4"
            onClick={handleAdminTap}
            className="mt-3 text-center leading-[1.5] text-gray-04"
          >
            결제 버튼을 누르면 카카오페이 결제 화면으로 이동해요
          </Typography>
        </div>
      </div>
    </div>
  );
}
