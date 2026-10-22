import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyCompatibilities, getMyResults, type AccountCompatibility } from "@/api/auth";
import { verifyResultCode } from "@/api/assessment";
import { accountQueryKey, useAuth } from "@/hooks/useAuth";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useToast } from "@/hooks/useToast";
import { startKakaoLogin } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { useMyResultStore } from "@/stores/myResultStore";
import { buildChemiTestMessage, canUseSystemShare, share } from "@/utils/share";
import Spinner from "@/components/shared/Spinner";
import {
  ArchiveCard,
  ArchiveTabs,
  Arrow,
  Desc,
  EmptyState,
  Eyebrow,
  History,
  PillButton,
  TextLink,
  Title,
  type ToyResult,
} from "@/components/archive/ArchiveParts";
import tokkiBox from "@/assets/img/archive/tokki-box.png";

type Tab = "results" | "compatibilities";

const formatShortDate = (iso: string) => {
  const date = new Date(iso);
  return `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, "0")}`;
};

const compatPath = (mine: string, friend: string) =>
  `/compatibility?mine=${encodeURIComponent(mine)}&friend=${encodeURIComponent(friend)}`;

// ------- 보관함 데이터 ------
// 로그인하면 계정에 보관된 결과·궁합을, 아니면 이 브라우저에 남은 결과 하나만 쓴다.
function useArchive(tab: Tab) {
  const auth = useAuth();
  const isMember = Boolean(auth.data);
  const localCode = useMyResultStore((s) => s.resultCode) ?? "";
  const local = useAssessmentResult(isMember ? "" : localCode);
  const results = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "results"],
    queryFn: getMyResults,
    enabled: isMember,
    retry: false,
  });
  const compatibilities = useQuery({
    queryKey: [...accountQueryKey, auth.data?.user_id, "compatibilities"],
    queryFn: getMyCompatibilities,
    enabled: isMember && tab === "compatibilities",
    retry: false,
  });

  const myResults: ToyResult[] = isMember
    ? (results.data?.items ?? []).map((r) => ({
        code: r.result_code,
        nickname: r.nickname,
        name: r.result_name || r.noun,
        noun: r.noun,
        image: r.image_url,
        date: formatShortDate(r.created_at),
      }))
    : local.data
      ? [
          {
            code: localCode,
            nickname: local.data.participant.nickname,
            name: local.data.overview.result_name || local.data.overview.noun,
            noun: local.data.overview.noun,
            image: local.data.overview.image_url,
          },
        ]
      : [];

  const isPending =
    auth.isPending ||
    (isMember
      ? results.isPending || (tab === "compatibilities" && compatibilities.isPending)
      : Boolean(localCode) && local.isPending);
  const isError = auth.isError || results.isError || compatibilities.isError;
  const retry = () => {
    if (auth.isError) void auth.refetch();
    if (results.isError) void results.refetch();
    if (compatibilities.isError) void compatibilities.refetch();
  };

  return {
    isMember,
    myResults,
    compatibilities: compatibilities.data?.items ?? [],
    isPending,
    isError,
    retry,
  };
}

/** 결과지의 "친구에게 케미 테스트 보내기"와 같은 링크·문구를 쓴다. */
function useShareChemi(mine?: ToyResult) {
  const toast = useToast();
  return async () => {
    if (!mine) return;
    const url = new URL("/", window.location.origin);
    url.searchParams.set("friend", mine.code);
    try {
      await navigator.clipboard.writeText(
        buildChemiTestMessage({ resultName: mine.name, url: url.toString() }),
      );
    } catch {
      // 클립보드 권한이 없어도 공유 시트는 띄운다
    }
    toast.open("문구를 복사했어요");
    if (canUseSystemShare()) {
      await share({
        title: `나 '${mine.name}' 나왔어.`,
        text: "우리 케미는 몇 점일까? 여기서 확인해줘!",
        url: url.toString(),
      });
    }
  };
}

function ResultsTab({ isMember, myResults }: { isMember: boolean; myResults: ToyResult[] }) {
  const navigate = useNavigate();
  const shareChemi = useShareChemi(myResults[0]);
  const openResult = (code: string) => navigate(`/result/${encodeURIComponent(code)}`);
  const [latest, ...older] = myResults;

  if (!latest && isMember) {
    return (
      <>
        <EmptyState image={tokkiBox} title="보관된 결과가 없어요">
          테스트를 완료하면 결과가
          <br />
          자동으로 이곳에 보관돼요.
        </EmptyState>
        <PillButton onClick={() => navigate("/?start=1")}>테스트 시작하기</PillButton>
        <TextLink onClick={() => navigate("/load")}>기존 결과 불러오기</TextLink>
      </>
    );
  }

  if (!latest) {
    return (
      <>
        <EmptyState image={tokkiBox} title="보관된 결과가 없어요">
          로그인하면 결과와 친구 궁합을
          <br />
          다른 기기에서도 다시 볼 수 있어요.
        </EmptyState>
        <div className="flex flex-col gap-3">
          <PillButton onClick={startKakaoLogin}>카카오로 로그인</PillButton>
          <PillButton tone="line" onClick={() => navigate("/load?step=code")}>
            결과 코드로 찾기
          </PillButton>
        </div>
      </>
    );
  }

  if (!isMember) {
    return (
      <>
        <ArchiveCard result={latest} onClick={() => openResult(latest.code)} />
        <section className="pt-[26px]">
          <strong className="text-gray-09 text-[15px]">이 결과를 잃어버리지 마세요</strong>
          <Desc className="mt-2 mb-[18px]">
            로그인하지 않으면 브라우저 기록과 함께 결과가 사라질 수 있어요.
          </Desc>
          <PillButton onClick={startKakaoLogin}>로그인하고 결과 보관하기</PillButton>
        </section>
        <TextLink onClick={() => navigate("/load")}>다른 결과 불러오기</TextLink>
      </>
    );
  }

  return (
    <>
      <p className="text-gray-06 mt-0.5 mb-3.5 text-[13px]">가장 최근 결과</p>
      <ArchiveCard result={latest} recent onClick={() => openResult(latest.code)} />
      {older.length > 0 && (
        <History
          summary={
            <>
              <strong className="text-gray-09 text-[14px]">다른 결과도 보기</strong>
              <span className="text-[13px]">{older.length}개 ⌄</span>
            </>
          }
        >
          {older.map((r) => (
            <ArchiveCard key={r.code} result={r} compact onClick={() => openResult(r.code)} />
          ))}
        </History>
      )}
      <div className="mt-auto pt-6">
        <PillButton onClick={() => void shareChemi()}>친구에게 궁합 테스트 보내기</PillButton>
        <TextLink onClick={() => navigate("/?start=1")}>새 테스트 시작하기</TextLink>
      </div>
    </>
  );
}

function PairCard({
  item,
  subtitle,
  onClick,
}: {
  item: AccountCompatibility;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-gray-02 mb-3 flex w-full cursor-pointer items-center gap-3.5 overflow-hidden rounded-[20px] border bg-white px-[17px] py-[19px] text-left"
    >
      <span className="grid h-[60px] w-[54px] shrink-0 place-items-center rounded-[18px] bg-[#fff1e9]">
        <img src={item.friend.image_url} alt="" className="size-[46px] object-contain" />
      </span>
      <span className="min-w-0">
        <strong className="text-gray-09 block truncate text-[15px]">
          {item.friend.nickname}님
        </strong>
        <span className="text-gray-06 block truncate text-[11px]">{subtitle}</span>
      </span>
      <span className="text-main ml-auto shrink-0 text-[20px] font-extrabold">
        {item.score}
        <small className="ml-0.5 text-[11px] font-medium">점</small>
      </span>
      <Arrow className="text-gray-06 ml-0 text-[20px]" />
    </button>
  );
}

function FriendCodeForm({ mineCode }: { mineCode: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!open) {
    return <TextLink onClick={() => setOpen(true)}>친구 결과 코드 입력하기</TextLink>;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const value = code.trim();
    if (!value || pending) return;
    setPending(true);
    const exists = await verifyResultCode(value);
    setPending(false);
    if (!exists) {
      setError("일치하는 결과가 없어요. 코드를 다시 확인해주세요.");
      return;
    }
    navigate(compatPath(mineCode, value));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6">
      <label htmlFor="friend-code" className="text-gray-09 mb-2.5 block text-[13px] font-bold">
        친구 결과 코드
      </label>
      <input
        id="friend-code"
        autoFocus
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          if (error) setError("");
        }}
        placeholder="예: si0KO1L8"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-invalid={Boolean(error)}
        aria-describedby="friend-code-error"
        className={cn(
          "text-gray-09 mb-2.5 w-full rounded-[14px] border bg-white p-4 text-[18px] tracking-[2px] placeholder:tracking-normal",
          error ? "border-[#c23c60]" : "border-[#d8dbe8]",
        )}
      />
      <p
        id="friend-code-error"
        role="alert"
        className="mb-3 min-h-[26px] text-[12px] text-[#b32d51]"
      >
        {error}
      </p>
      <PillButton tone="line" type="submit" disabled={!code.trim() || pending}>
        {pending ? <Spinner className="size-5" /> : "케미 확인하기"}
      </PillButton>
    </form>
  );
}

function CompatibilitiesTab({
  isMember,
  myResults,
  compatibilities,
}: {
  isMember: boolean;
  myResults: ToyResult[];
  compatibilities: AccountCompatibility[];
}) {
  const navigate = useNavigate();
  const [basisCode, setBasisCode] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const basis = myResults.find((r) => r.code === basisCode) ?? myResults[0];
  const shareChemi = useShareChemi(basis);

  if (!basis) {
    return (
      <>
        <EmptyState image={tokkiBox} title="먼저 내 장난감이 필요해요">
          내 테스트 결과를 가져오면
          <br />
          친구와의 케미를 확인할 수 있어요.
        </EmptyState>
        <PillButton onClick={() => navigate("/?start=1")}>테스트 시작</PillButton>
        {!isMember && (
          <PillButton tone="line" className="mt-3" onClick={startKakaoLogin}>
            로그인해서 불러오기
          </PillButton>
        )}
        <TextLink onClick={() => navigate("/load")}>기존 결과 불러오기</TextLink>
      </>
    );
  }

  const sorted = [...compatibilities].sort((a, b) => b.tested_at.localeCompare(a.tested_at));
  const withBasis = sorted.filter((c) => c.mine.result_code === basis.code);
  const others = sorted.filter((c) => c.mine.result_code !== basis.code);
  const openPair = (c: AccountCompatibility) =>
    navigate(compatPath(c.mine.result_code, c.friend.result_code));

  return (
    <>
      <div className="flex items-center gap-3.5 pb-[25px]">
        <span className="grid size-[62px] shrink-0 place-items-center rounded-[18px] bg-[#e9ecff]">
          <img src={basis.image} alt={basis.noun} className="size-[52px] object-contain" />
        </span>
        <span className="min-w-0">
          <span className="text-gray-06 block text-[11px]">현재 내 결과</span>
          <strong className="text-gray-09 block text-[15px] leading-[1.4] break-keep">
            {basis.name} {basis.nickname}
          </strong>
        </span>
        {myResults.length > 1 && (
          <button
            type="button"
            aria-expanded={picking}
            onClick={() => setPicking((v) => !v)}
            className="text-gray-06 ml-auto shrink-0 cursor-pointer text-[12px] whitespace-nowrap underline underline-offset-4"
          >
            결과 바꾸기
          </button>
        )}
      </div>
      {picking && (
        <div className="mb-6">
          <label htmlFor="basis" className="text-gray-09 mb-2.5 block text-[13px] font-bold">
            궁합의 기준이 될 결과
          </label>
          <select
            id="basis"
            value={basis.code}
            onChange={(e) => {
              setBasisCode(e.target.value);
              setPicking(false);
            }}
            className="text-gray-09 w-full rounded-[14px] border border-[#d8dbe8] bg-white p-4 text-[14px]"
          >
            {myResults.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name} {r.nickname}
              </option>
            ))}
          </select>
        </div>
      )}

      {isMember ? (
        <>
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-gray-09 text-[16px] font-bold">
              친구와의 케미 <span className="text-main ml-1.5">{withBasis.length}</span>
            </h3>
            <span className="text-gray-06 text-[11px]">최근 확인순</span>
          </div>
          {withBasis.length ? (
            withBasis.map((c, i) => (
              <PairCard
                key={`${c.friend.result_code}-${c.tested_at}-${i}`}
                item={c}
                subtitle={c.friend.result_name || c.friend.noun}
                onClick={() => openPair(c)}
              />
            ))
          ) : (
            <Desc className="my-3 text-center">이 결과로 본 케미가 아직 없어요.</Desc>
          )}
          {others.length > 0 && (
            <History
              summary={<span className="text-[13px]">이전 결과로 본 궁합 · {others.length}</span>}
            >
              <div className="pt-4">
                {others.map((c, i) => (
                  <PairCard
                    key={`${c.mine.result_code}-${c.friend.result_code}-${c.tested_at}-${i}`}
                    item={c}
                    subtitle={`내 ${c.mine.noun} 결과로 봤어요`}
                    onClick={() => openPair(c)}
                  />
                ))}
              </div>
            </History>
          )}
          <PillButton className="mt-4" onClick={() => void shareChemi()}>
            친구에게 링크 보내기 ↗
          </PillButton>
          <FriendCodeForm mineCode={basis.code} />
        </>
      ) : (
        <>
          <section className="relative mb-8 rounded-[22px] bg-[#eff0ff] p-6">
            <span aria-hidden className="absolute top-6 right-6 rotate-12 text-[32px]">
              ✳
            </span>
            <h3 className="text-gray-09 mb-2 text-[20px] leading-[1.4] font-bold tracking-[-0.6px]">
              친구의 장난감과
              <br />
              만나볼 시간!
            </h3>
            <Desc>링크를 보내고 우리만의 케미를 찾아요.</Desc>
            <PillButton small className="mt-5" onClick={() => void shareChemi()}>
              친구에게 링크 보내기 ↗
            </PillButton>
          </section>
          <div className="my-[18px] rounded-[14px] bg-[#fff5dc] p-[15px] text-[12px] leading-[1.6]">
            지금은 이 브라우저의 결과를 보고 있어요.
            <br />
            로그인하면 저장된 결과와 궁합 기록을 불러올 수 있어요.
          </div>
          <PillButton tone="line" onClick={startKakaoLogin}>
            로그인해서 불러오기
          </PillButton>
          <FriendCodeForm mineCode={basis.code} />
        </>
      )}
    </>
  );
}

// ------- 내 보관함 (내 결과 / 내 궁합) ------
export default function MyArchivePage({ tab }: { tab: Tab }) {
  const navigate = useNavigate();
  const archive = useArchive(tab);
  const { isMember, myResults } = archive;
  const has = myResults.length > 0;

  const heading =
    tab === "compatibilities" ? (
      <>
        <Eyebrow>MY COLLECTION</Eyebrow>
        <Title>
          내 궁합<span className="text-main">.</span>
        </Title>
        <Desc>우리 사이, 어떤 케미가 숨어 있을까요?</Desc>
      </>
    ) : (
      <>
        <Eyebrow>내 보관함</Eyebrow>
        <Title className="mb-0">
          {!isMember && !has ? (
            <>
              장난감을 안전하게
              <br />
              보관해요
            </>
          ) : !isMember ? (
            <>
              이 브라우저에
              <br />
              보관된 장난감
            </>
          ) : !has ? (
            <>
              아직 보관된
              <br />
              장난감이 없어요
            </>
          ) : (
            <>
              내 장난감과
              <br />
              친구 케미를 모아봤어요
            </>
          )}
        </Title>
      </>
    );

  return (
    <section className="flex min-h-[calc(100dvh-64px)] flex-col px-6 pt-[30px] pb-7">
      {archive.isPending ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-gray-04 size-6" />
        </div>
      ) : (
        <>
          {heading}
          {/* 비로그인·결과 없음의 내 결과는 원래 시안처럼 탭 없이 로그인 안내만 둔다 */}
          {(isMember || has || tab === "compatibilities") && (
            <ArchiveTabs active={tab} onSelect={(t) => navigate(`/my/${t}`, { replace: true })} />
          )}
          {archive.isError ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <Desc>목록을 불러오지 못했어요.</Desc>
              <PillButton tone="line" className="w-auto" onClick={archive.retry}>
                다시 시도
              </PillButton>
            </div>
          ) : tab === "results" ? (
            <ResultsTab isMember={isMember} myResults={myResults} />
          ) : (
            <CompatibilitiesTab
              isMember={isMember}
              myResults={myResults}
              compatibilities={archive.compatibilities}
            />
          )}
        </>
      )}
    </section>
  );
}
