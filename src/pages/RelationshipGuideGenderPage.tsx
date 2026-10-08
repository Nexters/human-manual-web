import { useState, type ReactNode } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import Typography from "@/components/shared/Typography";
import { useCompatibility } from "@/hooks/useCompatibility";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { startKakaoLogin, syncMyResult } from "@/api/payment";
import { takeResultCode } from "@/lib/resultCode";
import { getPendingGenderSelection, savePendingGenderSelection } from "@/lib/paymentFlow";
import { cn } from "@/lib/cn";
import QuestionCtaButton from "@/components/question/QuestionCtaButton";
import tokkiThinkingImage from "@/assets/img/relationshipReport/tokki-thinking.png";
import { reportPaths } from "@/components/relationshipReport/reportFlow";

const GENDERS = ["여자", "남자"] as const;
type Gender = (typeof GENDERS)[number];

const isGender = (value: string | undefined): value is Gender =>
  GENDERS.some((gender) => gender === value);

const GENDER_STYLE: Record<Gender, { button: string; card: string; toy: string }> = {
  여자: {
    button: "border-sub-4 bg-[#fff3f8] text-sub-4",
    card: "border-[#f5d6e6]",
    toy: "bg-[#fff3f8]",
  },
  남자: {
    button: "border-main bg-[#f2f6ff] text-main",
    card: "border-[#dbe3ff]",
    toy: "bg-[#f2f6ff]",
  },
};

function CenterMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 text-center">
      <Typography variant="me2" className="text-gray-07 break-keep">
        {children}
      </Typography>
    </div>
  );
}

export default function RelationshipGuideGenderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mine = takeResultCode(searchParams.get("mine")) ?? "";
  const friend = takeResultCode(searchParams.get("friend")) ?? "";
  const { data, isLoading, isError } = useCompatibility(mine, friend);
  const { open, close } = useModal();
  const { open: openToast } = useToast();
  const [isContinuing, setIsContinuing] = useState(false);
  const [savedSelection] = useState(() => getPendingGenderSelection(mine, friend));
  const [mineGender, setMineGender] = useState<Gender | null>(() =>
    isGender(savedSelection?.mineGender) ? savedSelection.mineGender : null,
  );
  const [partnerGender, setPartnerGender] = useState<Gender | null>(() =>
    isGender(savedSelection?.partnerGender) ? savedSelection.partnerGender : null,
  );

  const topBar = (
    <TopBar
      title="설명서 준비"
      onBack={() =>
        navigate(
          `/compatibility?mine=${encodeURIComponent(mine)}&friend=${encodeURIComponent(friend)}`,
        )
      }
    />
  );

  if (!mine || !friend) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <CenterMessage>궁합 정보를 찾을 수 없어요. 궁합 결과에서 다시 시작해주세요.</CenterMessage>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <CenterMessage>두 사람의 정보를 불러오고 있어요</CenterMessage>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        {topBar}
        <CenterMessage>정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</CenterMessage>
      </div>
    );
  }

  const people = [
    { person: data.mine, isMine: true, value: mineGender, onChange: setMineGender },
    { person: data.friend, isMine: false, value: partnerGender, onChange: setPartnerGender },
  ];

  const handleCreate = () => {
    if (!mineGender || !partnerGender) return;

    open({
      title: "이대로 진행할까요?",
      contents: (
        <div className="flex w-full flex-col gap-4">
          <div className="bg-gray-01 flex flex-col gap-2 rounded-[10px] px-4 py-3">
            {[
              [data.mine.nickname, mineGender],
              [data.friend.nickname, partnerGender],
            ].map(([nickname, gender]) => (
              <div key={nickname} className="flex items-center justify-between">
                <Typography variant="me2" className="text-gray-07">
                  {nickname}
                </Typography>
                <Typography variant="sb4" className="text-gray-09">
                  {gender}
                </Typography>
              </div>
            ))}
          </div>
          <Typography variant="me3" className="text-gray-06 text-center break-keep">
            선택한 성별은 설명서 내용에 그대로 반영돼요.
            <br />
            <span className="text-red font-semibold">
              잘못 선택해도 환불되지 않으니 정확히 확인해주세요.
            </span>
          </Typography>
        </div>
      ),
      confirmLabel: "결제 페이지로",
      onConfirm: () => {
        close();
        savePendingGenderSelection(mine, friend, { mineGender, partnerGender });
        setIsContinuing(true);
        void syncMyResult(mine)
          .then(() => navigate(reportPaths.checkout(mine, friend)))
          .catch((error) => {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              const returnTo = new URL(reportPaths.checkout(mine, friend), window.location.origin);
              startKakaoLogin(returnTo.href);
              return;
            }
            setIsContinuing(false);
            openToast("로그인을 확인하지 못했어요. 잠시 후 다시 시도해주세요");
          });
      },
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {topBar}

      <div className="flex flex-1 flex-col px-[18px] pt-[34px] pb-5">
        <section className="mb-6 flex items-center justify-between gap-2 pl-1">
          <div className="min-w-0">
            <h1 className="text-gray-09 text-[30px] leading-[1.3] font-extrabold tracking-[-1.45px] break-keep">
              두 사람의
              <br />
              <span className="text-sub-4">성별</span>을
              <br />
              알려주세요
            </h1>
            <Typography variant="me3" className="text-gray-06 mt-2.5 break-keep">
              두 사람에게 맞는 표현을
              <br />
              위해 필요해요.
            </Typography>
          </div>
          <img
            src={tokkiThinkingImage}
            alt=""
            className="-mr-[18px] w-[200px] shrink-0 [mask-image:linear-gradient(to_right,transparent,#000_22%,#000_82%,transparent),linear-gradient(to_bottom,transparent,#000_22%,#000_80%,transparent)] [mask-composite:intersect]"
          />
        </section>

        <div className="flex flex-col gap-2.5">
          {people.map(({ person, isMine, value, onChange }) => (
            <section
              key={person.nickname}
              aria-label={`${person.nickname}님의 성별`}
              className={cn(
                "grid min-h-[130px] grid-cols-[72px_1fr] items-center gap-[13px] rounded-[20px] border bg-white px-[15px] py-3.5 transition-colors",
                value
                  ? cn(GENDER_STYLE[value].card, "shadow-[0_7px_22px_rgba(25,31,40,0.035)]")
                  : "border-gray-02",
              )}
            >
              <span
                className={cn(
                  "grid size-[70px] place-items-center rounded-full transition-colors",
                  value ? GENDER_STYLE[value].toy : "bg-[#f7f8fa]",
                )}
              >
                <img
                  src={person.image_url}
                  alt={person.noun}
                  className="size-[62px] object-contain"
                />
              </span>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <Typography
                    variant="sb3"
                    as="h2"
                    className="text-gray-09 truncate font-extrabold"
                  >
                    {person.nickname}님
                  </Typography>
                  {isMine && (
                    <span className="text-gray-05 shrink-0 rounded-full bg-[#f5f6f8] px-[7px] py-1 text-[10px] font-extrabold">
                      나
                    </span>
                  )}
                </div>
                <p className="text-gray-06 mt-0.5 mb-2.5 text-[12px] font-semibold">
                  {person.noun}
                </p>
                <div className="grid grid-cols-2 gap-[7px]">
                  {GENDERS.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      aria-pressed={value === gender}
                      onClick={() => onChange(gender)}
                      className={cn(
                        "h-10 cursor-pointer rounded-[11px] border text-[14px] font-extrabold transition-colors",
                        value === gender
                          ? GENDER_STYLE[gender].button
                          : "border-gray-02 text-gray-05 bg-white",
                      )}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <p className="mx-1 mt-[11px] text-[11px] leading-[1.45] tracking-[-0.25px] text-[#9aa3ad]">
          각자 따로 선택할 수 있어요. 같은 성별 조합도 가능해요.
        </p>

        <div className="mt-auto pt-[18px]">
          <QuestionCtaButton
            type="button"
            tone="point"
            disabled={!mineGender || !partnerGender || isContinuing}
            onClick={handleCreate}
          >
            {isContinuing ? "로그인 확인 중이에요" : "다음"}
          </QuestionCtaButton>
        </div>
      </div>
    </div>
  );
}
