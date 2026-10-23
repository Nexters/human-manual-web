import KakaoLoginButton from "@/components/auth/KakaoLoginButton";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyCompatibilities,
  getMyResults,
  selectPrimaryResult,
  deleteAccountResult,
  type AccountCompatibility,
} from "@/api/auth";
import { accountQueryKey, useAuth } from "@/hooks/useAuth";
import { useAssessmentResult } from "@/hooks/useAssessment";
import { useCompatibilityRanking } from "@/hooks/useCompatibility";
import { useChemiShareModal as useShareChemi } from "@/hooks/useChemiShareModal";
import { useModal } from "@/hooks/useModal";
import { startKakaoLogin } from "@/lib/auth";
import { useMyResultStore } from "@/stores/myResultStore";
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
// 로그인하면 계정에 보관된 결과·케미를, 아니면 이 브라우저에 남은 결과 하나만 쓴다.
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

function ResultsTab({ isMember, myResults }: { isMember: boolean; myResults: ToyResult[] }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const auth = useAuth();
  const { open, close } = useModal();
  const [actionError, setActionError] = useState("");
  const manage = useMutation({
    mutationFn: async ({ code, action }: { code: string; action: "primary" | "delete" }) => {
      if (action === "primary") await selectPrimaryResult(code);
      else await deleteAccountResult(code);
      return await getMyResults();
    },
    onMutate: () => setActionError(""),
    onSuccess: (data) => {
      queryClient.setQueryData([...accountQueryKey, auth.data?.user_id, "results"], data);
      void queryClient.invalidateQueries({
        queryKey: [...accountQueryKey, auth.data?.user_id, "compatibilities"],
      });
      const nextCode = data.items[0]?.result_code;
      if (nextCode) useMyResultStore.getState().setResultCode(nextCode);
      else useMyResultStore.getState().clearResultCode();
    },
    onError: (error) =>
      setActionError(
        isAxiosError(error) && error.response?.status === 409
          ? "대표 결과는 삭제할 수 없어요. 먼저 다른 결과를 대표로 설정해주세요."
          : "변경하지 못했어요. 다시 시도해주세요.",
      ),
  });
  const requestDelete = (result: ToyResult) =>
    open({
      title: "이 결과를 보관함에서 삭제할까요?",
      contents: (
        <div className="space-y-4 text-center">
          <p className="text-gray-06 text-sm leading-relaxed">
            {result.noun} {result.nickname} 결과가 보관함에서 사라져요. 기존 공유 링크와 구매 내역은
            유지돼요.
          </p>
          <button type="button" className="text-gray-06 min-h-11 px-4" onClick={close}>
            취소
          </button>
        </div>
      ),
      confirmLabel: "삭제하기",
      onConfirm: () => {
        close();
        manage.mutate({ code: result.code, action: "delete" });
      },
    });
  const actions = (result: ToyResult) => (
    <>
      <button
        type="button"
        className="text-main min-h-10 cursor-pointer rounded-full border border-[#e3e6ff] px-3 text-[12px] font-bold disabled:opacity-40"
        disabled={manage.isPending}
        onClick={() => manage.mutate({ code: result.code, action: "primary" })}
        aria-label={`${result.noun} ${result.nickname} 대표로 설정`}
      >
        대표로 설정
      </button>
      <button
        type="button"
        className="text-gray-06 min-h-10 cursor-pointer rounded-full px-3 text-[12px] disabled:opacity-40"
        disabled={manage.isPending}
        onClick={() => requestDelete(result)}
        aria-label={`${result.noun} ${result.nickname} 삭제`}
      >
        삭제
      </button>
    </>
  );
  const shareChemi = useShareChemi(myResults[0]);
  const openResult = (code: string) => navigate(`/result/${encodeURIComponent(code)}`);
  const [primaryResult, ...older] = myResults;

  if (!primaryResult && isMember) {
    return (
      <>
        <EmptyState image={tokkiBox} title="보관된 결과가 없어요">
          테스트를 완료하면 결과가
          <br />
          자동으로 이곳에 보관돼요.
        </EmptyState>
        <PillButton onClick={() => navigate("/?start=1")}>테스트 시작하기</PillButton>
      </>
    );
  }

  if (!primaryResult) {
    return (
      <>
        <EmptyState image={tokkiBox} title="보관된 결과가 없어요">
          로그인하면 결과와 친구 케미를
          <br />
          다른 기기에서도 다시 볼 수 있어요.
        </EmptyState>
        <div className="flex flex-col gap-3">
          <KakaoLoginButton onClick={startKakaoLogin} />
        </div>
      </>
    );
  }

  if (!isMember) {
    return (
      <>
        <ArchiveCard result={primaryResult} onClick={() => openResult(primaryResult.code)} />
        <section className="pt-[26px]">
          <strong className="text-gray-09 text-[15px]">이 결과를 잃어버리지 마세요</strong>
          <Desc className="mt-2 mb-[18px]">
            로그인하지 않으면 브라우저 기록과 함께 결과가 사라질 수 있어요.
          </Desc>
          <KakaoLoginButton onClick={startKakaoLogin} />
        </section>
      </>
    );
  }

  return (
    <>
      <p className="text-gray-06 mt-0.5 mb-3.5 text-[13px]">대표 결과</p>
      <p className="text-gray-06 mb-4 text-[12px]">
        홈과 친구 케미 테스트에서 사용할 결과를 골라주세요.
      </p>
      {actionError && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {actionError}
        </p>
      )}
      <ArchiveCard result={primaryResult} onClick={() => openResult(primaryResult.code)} />
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
            <ArchiveCard
              key={r.code}
              result={r}
              compact
              onClick={() => openResult(r.code)}
              actions={actions(r)}
            />
          ))}
        </History>
      )}
      <div className="mt-auto pt-6">
        <PillButton onClick={() => void shareChemi()}>친구에게 케미 테스트 보내기</PillButton>
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
  item: { score: number; friend: { nickname: string | null; image_url: string } };
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
          {item.friend.nickname ?? "친구"}님
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
  const basis = myResults[0];
  const basisDetail = useAssessmentResult(basis?.code ?? "");
  const shareChemi = useShareChemi(basis);
  const localRanking = useCompatibilityRanking(!isMember ? (basis?.code ?? "") : "");

  if (!basis) {
    return (
      <>
        <EmptyState image={tokkiBox} title="먼저 내 장난감이 필요해요">
          내 테스트 결과를 가져오면
          <br />
          친구와의 케미를 확인할 수 있어요.
        </EmptyState>
        <PillButton onClick={() => navigate("/?start=1")}>테스트 시작</PillButton>
        {!isMember && <KakaoLoginButton className="mt-3" onClick={startKakaoLogin} />}
      </>
    );
  }

  // 두 결과가 모두 내 계정에 있어도, 대표 결과가 어느 쪽이었든 같은 케미로 묶는다.
  const sorted = compatibilities
    .map((item) =>
      item.friend.result_code === basis.code
        ? { ...item, mine: item.friend, friend: item.mine }
        : item,
    )
    .sort((a, b) => b.tested_at.localeCompare(a.tested_at));
  const withBasis = sorted.filter((c) => c.mine.result_code === basis.code);
  const others = sorted.filter((c) => c.mine.result_code !== basis.code);
  const openPair = (c: AccountCompatibility) =>
    navigate(compatPath(c.mine.result_code, c.friend.result_code));

  return (
    <>
      <div className="mb-3 flex min-h-[32px] items-center justify-between gap-3">
        <span className="text-gray-05 text-[11px] font-medium">
          {isMember ? "대표 결과" : "현재 내 결과"}
        </span>
      </div>
      <div className="flex items-center gap-3.5 pb-[25px]">
        <span className="grid size-[62px] shrink-0 place-items-center rounded-[18px] bg-[#e9ecff]">
          <img src={basis.image} alt={basis.noun} className="size-[52px] object-contain" />
        </span>
        <span className="min-w-0 flex-1">
          {basisDetail.data?.overview.adjective && (
            <span className="text-gray-06 block text-[12px] leading-[1.6] break-keep [overflow-wrap:anywhere]">
              {basisDetail.data.overview.adjective}
            </span>
          )}
          <strong className="text-gray-09 mt-1 block text-[18px] leading-[1.4] font-bold break-keep [overflow-wrap:anywhere]">
            {[basis.noun, basis.nickname].filter(Boolean).join(" ")}
          </strong>
        </span>
      </div>

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
              summary={<span className="text-[13px]">이전 결과로 본 케미 · {others.length}</span>}
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
        </>
      ) : (
        <>
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-gray-09 text-[16px] font-bold">
              친구와의 케미{" "}
              <span className="text-main ml-1.5">{localRanking.data?.total ?? 0}</span>
            </h3>
            <span className="text-gray-06 text-[11px]">케미 점수순</span>
          </div>
          {localRanking.isPending ? (
            <div
              className="flex justify-center py-6"
              role="status"
              aria-label="케미 기록 불러오는 중"
            >
              <Spinner className="size-5" />
            </div>
          ) : localRanking.isError ? (
            <div role="alert" className="mb-6 text-center">
              <Desc>케미 기록을 불러오지 못했어요.</Desc>
              <TextLink onClick={() => void localRanking.refetch()}>다시 시도</TextLink>
            </div>
          ) : localRanking.data?.rankings.length ? (
            localRanking.data.rankings.map((friend) => (
              <PairCard
                key={friend.result_code}
                item={{ friend, score: friend.score }}
                subtitle={friend.result_name || friend.noun}
                onClick={() => navigate(compatPath(basis.code, friend.result_code))}
              />
            ))
          ) : (
            <Desc className="my-3 text-center">이 결과로 본 케미가 아직 없어요.</Desc>
          )}
          <section className="relative mt-4 mb-8 rounded-[22px] bg-[#eff0ff] p-6">
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
            로그인하면 다른 기기에서도 결과와 케미 기록을 다시 볼 수 있어요.
          </div>
          <KakaoLoginButton onClick={startKakaoLogin} />
        </>
      )}
    </>
  );
}

// ------- 내 보관함 (내 결과 / 내 케미) ------
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
          내 케미<span className="text-main">.</span>
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
