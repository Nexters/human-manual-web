import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { syncResults } from "@/api/auth";
import { getAssessmentResult } from "@/api/assessment";
import { accountQueryKey, useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { startKakaoLogin } from "@/lib/auth";
import { trackEvent } from "@/lib/google-analytics";
import { GA_EVENTS } from "@/lib/google-analytics/event";
import { cn } from "@/lib/cn";
import { useMyResultStore } from "@/stores/myResultStore";
import Spinner from "@/components/shared/Spinner";
import {
  AccountStatus,
  Arrow,
  ChevronDown,
  Desc,
  Eyebrow,
  Note,
  PillButton,
  TextLink,
  Title,
  type ToyResult,
} from "@/components/archive/ArchiveParts";
import logo from "@/assets/img/logo.png";
import tokkiPhone from "@/assets/img/archive/tokki-phone.png";

type Step = "choice" | "code" | "found";

function LoadHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between px-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="이전 화면"
        className="hover:bg-gray-01 grid size-11 cursor-pointer place-items-center rounded-full text-[25px]"
      >
        ‹
      </button>
      <img src={logo} alt="Pakit" className="w-[84px]" />
      <span className="size-11" />
    </header>
  );
}

function Option({
  primary,
  icon,
  title,
  description,
  onClick,
}: {
  primary?: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mb-3 flex w-full cursor-pointer items-center gap-3.5 rounded-[20px] border px-5 py-[23px] text-left transition-[filter] hover:brightness-[0.97]",
        primary ? "bg-main border-main text-white" : "border-gray-02 text-gray-09 bg-white",
      )}
    >
      <span
        className={cn(
          "grid size-[42px] shrink-0 place-items-center rounded-[14px] text-[23px]",
          primary ? "bg-white/15 text-white" : "text-main bg-[#f0f1ff]",
        )}
      >
        {icon}
      </span>
      <span>
        <strong className="block text-[16px]">{title}</strong>
        <small className="mt-[5px] block text-[12px] opacity-70">{description}</small>
      </span>
      <Arrow />
    </button>
  );
}

// ------- 결과 불러오기 ------
// 비로그인은 로그인/코드 중 고르고, 로그인 상태면 코드 입력부터 보여준다.
// 코드로 찾은 결과는 비로그인이면 이 브라우저에, 로그인이면 계정에 보관한다.
export default function ResultLoadPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const isMember = Boolean(auth.data);
  const remember = useMyResultStore((s) => s.setResultCode);
  const [searchParams] = useSearchParams();
  // 보관함의 "결과 코드로 찾기"처럼 이미 코드를 고른 입구는 ?step=code 로 바로 입력부터 연다.
  const [step, setStep] = useState<Step>(searchParams.get("step") === "code" ? "code" : "choice");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [found, setFound] = useState<ToyResult | null>(null);

  const current: Step = step === "choice" && isMember ? "code" : step;
  const goBack = () => {
    if (current !== "choice" && !isMember) {
      setStep("choice");
      setError("");
      return;
    }
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/my/results");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const value = code.trim();
    if (!value || pending) return;
    setPending(true);
    setError("");
    try {
      const data = await getAssessmentResult(value);
      if (isMember) {
        await syncResults([value]);
        void queryClient.invalidateQueries({ queryKey: accountQueryKey });
      }
      remember(value);
      setFound({
        code: value,
        nickname: data.participant.nickname,
        name: data.overview.result_name || data.overview.noun,
        noun: data.overview.noun,
        image: data.overview.image_url,
      });
      trackEvent(GA_EVENTS.ONBOARDING.MY_RESULT_CODE_VERIFIED);
      setStep("found");
    } catch (e) {
      setError(
        isAxiosError(e) && e.response?.status === 404
          ? "일치하는 결과가 없어요. 코드를 다시 확인해주세요."
          : "결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setPending(false);
    }
  };

  const openResult = () => found && navigate(`/result/${encodeURIComponent(found.code)}`);

  let body: ReactNode;
  if (auth.isPending) {
    body = (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="text-gray-04 size-6" />
      </div>
    );
  } else if (current === "found" && found && isMember) {
    body = (
      <>
        <AccountStatus left="✓ 로그인됨" right="내 계정에 연결 완료" />
        <div className="text-main mt-[38px] mb-6 grid size-16 place-items-center rounded-full bg-[#e9edff] text-[30px]">
          ✓
        </div>
        <Eyebrow>SAFELY IN YOUR COLLECTION</Eyebrow>
        <Title>
          내 보관함에
          <br />잘 넣어두었어요.
        </Title>
        <Desc>
          이제 다른 기기에서도 이 결과와
          <br />
          친구와의 궁합을 이어서 볼 수 있어요.
        </Desc>
        <div className="border-gray-02 my-[30px] flex items-center gap-3.5 border-y py-[22px]">
          <span className="grid size-[62px] shrink-0 place-items-center rounded-[18px] bg-[#e9ecff]">
            <img src={found.image} alt={found.noun} className="size-[52px] object-contain" />
          </span>
          <span className="min-w-0">
            <span className="text-gray-06 block text-[11px]">추가된 결과</span>
            <strong className="text-gray-09 block text-[15px] leading-[1.4] break-keep">
              {found.name}
            </strong>
          </span>
          <span className="text-main ml-auto shrink-0 rounded-[20px] bg-[#eef2ff] px-2 py-[5px] text-[10px]">
            보관 완료
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <PillButton onClick={openResult}>내 결과 보러가기</PillButton>
          <PillButton tone="line" onClick={() => navigate("/my/compatibilities")}>
            친구와 케미 보기
          </PillButton>
        </div>
        <TextLink
          onClick={() => {
            setCode("");
            setStep("code");
          }}
        >
          다른 결과도 불러오기
        </TextLink>
      </>
    );
  } else if (current === "found" && found) {
    body = (
      <>
        <Eyebrow>찾았어요!</Eyebrow>
        <Title>
          반가워요,
          <br />
          나의 장난감.
        </Title>
        <div className="my-6 rounded-[20px] bg-[#f0f2ff] p-6 text-center">
          <span className="mx-auto mb-[18px] grid size-[90px] place-items-center rounded-[18px] bg-[#e9ecff]">
            <img src={found.image} alt={found.noun} className="size-[76px] object-contain" />
          </span>
          <p className="text-gray-06 text-[11px]">{found.nickname}님을 닮은 장난감</p>
          <h3 className="text-gray-09 my-2.5 text-[23px] leading-[1.4] font-bold break-keep">
            {found.name}
          </h3>
        </div>
        <PillButton onClick={openResult}>내 결과 보기</PillButton>
        <PillButton tone="line" className="mt-3" onClick={() => startKakaoLogin("/my/results")}>
          로그인하고 보관하기
        </PillButton>
        <Note>로그인하면 결과를 계정에 보관할 수 있어요.</Note>
      </>
    );
  } else if (current === "code") {
    body = (
      <>
        {isMember && <AccountStatus left="● 로그인됨" right="나의 보관함에 추가" />}
        <Eyebrow>{isMember ? "ADD TO MY COLLECTION" : "로그인 없이 찾기"}</Eyebrow>
        <Title>
          {isMember ? (
            <>
              흩어져 있던 내 결과,
              <br />
              한곳에 모아두세요.
            </>
          ) : (
            <>
              결과 코드만 있으면
              <br />
              다시 만날 수 있어요.
            </>
          )}
        </Title>
        <Desc>
          {isMember ? (
            <>
              이전에 받은 결과 코드를 입력하면
              <br />
              지금 로그인한 계정에 보관할 수 있어요.
            </>
          ) : (
            <>
              테스트 완료 화면이나 공유 링크에 있는
              <br />
              결과 코드를 입력해주세요.
            </>
          )}
        </Desc>
        {isMember && (
          <div className="mt-3 -mb-[5px] flex h-[170px] justify-center">
            <img src={tokkiPhone} alt="" className="h-[170px] w-[175px] object-contain" />
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate className={isMember ? "mt-5 mb-3" : "mt-9 mb-3.5"}>
          <label htmlFor="result-code" className="text-gray-09 mb-2.5 block text-[13px] font-bold">
            결과 코드
          </label>
          <input
            id="result-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError("");
            }}
            placeholder="예: 87mSpdHo"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-invalid={Boolean(error)}
            aria-describedby="result-code-error"
            className={cn(
              "text-gray-09 mb-2.5 w-full rounded-[14px] border bg-white p-4 text-[18px] tracking-[2px] placeholder:tracking-normal",
              error ? "border-[#c23c60]" : "border-[#d8dbe8]",
            )}
          />
          <p
            id="result-code-error"
            role="alert"
            className="mb-3 min-h-[26px] text-[12px] text-[#b32d51]"
          >
            {error}
          </p>
          <PillButton type="submit" disabled={!code.trim() || pending}>
            {pending ? (
              <Spinner className="size-5" />
            ) : (
              <>
                {isMember ? "내 결과 찾아보기" : "결과 찾기"} <span aria-hidden>→</span>
              </>
            )}
          </PillButton>
        </form>
        <details className="group border-gray-02 border-b py-[18px] text-[13px]">
          <summary className="text-gray-06 flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
            결과 코드는 어디에 있나요?
            <ChevronDown className="transition-transform group-open:rotate-180" />
          </summary>
          <Desc className="mt-2.5 text-[13px]">
            테스트 완료 화면의 결과 코드 또는 친구에게 공유했던 링크에서 확인할 수 있어요.
          </Desc>
        </details>
        {!isMember && (
          <PillButton tone="line" className="mt-6" onClick={() => startKakaoLogin("/my/results")}>
            로그인해서 불러오기
          </PillButton>
        )}
        <Note>
          {isMember
            ? "결과를 먼저 확인한 뒤, 내 계정에 보관할 수 있어요."
            : "계정에 저장된 결과가 있다면 로그인해서 불러올 수 있어요."}
        </Note>
      </>
    );
  } else {
    body = (
      <>
        <Eyebrow>WELCOME BACK</Eyebrow>
        <Title>
          내 장난감을
          <br />
          다시 만나볼까요?
        </Title>
        <Desc>
          저장해둔 나의 모습부터 친구와의 케미까지,
          <br />
          이어서 꺼내볼 수 있어요.
        </Desc>
        <div className="flex flex-1 items-center justify-center py-2">
          <img src={tokkiPhone} alt="" className="h-[220px] w-[240px] object-contain" />
        </div>
        <Option
          primary
          icon="●"
          title="로그인해서 불러오기"
          description="저장된 최신 결과와 궁합 기록을 한 번에"
          onClick={() => startKakaoLogin("/my/results")}
        />
        <Option
          icon="#"
          title="결과 코드로 찾기"
          description="로그인 없이 내 결과를 바로 확인해요"
          onClick={() => setStep("code")}
        />
        <Note>코드로 찾은 결과도 나중에 계정에 보관할 수 있어요.</Note>
      </>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <LoadHeader onBack={goBack} />
      <div className="flex flex-1 flex-col px-6 pt-[30px] pb-7">{body}</div>
    </div>
  );
}
