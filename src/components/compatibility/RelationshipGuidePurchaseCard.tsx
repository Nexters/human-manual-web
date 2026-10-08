import Typography from "@/components/shared/Typography";

type RelationshipGuidePurchaseCardProps = {
  mineNickname: string;
  friendNickname: string;
  hasPurchased?: boolean;
  onPurchase: () => void;
};

const lockedTopics = [
  {
    title: "왜 같은 상황을 서로 다르게 받아들일까요?",
    description: "두 사람의 관계 작동 방식",
  },
  {
    title: "서운함이 반복될 때 어디서 멈춰야 할까요?",
    description: "두 사람만의 갈등 루프와 멈춤 지점",
  },
  {
    title: "서로에게 어떤 말과 행동이 가장 잘 닿을까요?",
    description: "각자에게 해주면 좋은 구체적인 방법",
  },
] as const;

const includedContents = [
  {
    title: "반복되는 갈등과 오해의 흐름",
    description: "누가 잘못했는지가 아니라 둘 사이에서 커지는 과정을 분석해요.",
  },
  {
    title: "서로에게 바로 해주면 좋은 행동",
    description: "각자에게 필요한 말과 타이밍을 구체적으로 제안해요.",
  },
  {
    title: "둘만의 관계 규칙 3~5개",
    description: "다음에 같은 장면이 왔을 때 써볼 약속을 만들어요.",
  },
] as const;

function LockedTopic({ title, description }: (typeof lockedTopics)[number]) {
  return (
    <li className="flex min-h-[66px] items-center gap-3 rounded-2xl border border-[#f1e5ec] bg-white px-3.5 py-3">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f8] text-base"
      >
        🔒
      </span>
      <div className="min-w-0">
        <Typography variant="sb4" className="text-gray-08 break-keep">
          {title}
        </Typography>
        <Typography variant="me4" className="mt-1 text-gray-05">
          {description}
        </Typography>
      </div>
    </li>
  );
}

function IncludedContent({ title, description }: (typeof includedContents)[number]) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="bg-sub-4 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
      >
        ✓
      </span>
      <div className="min-w-0">
        <Typography variant="sb4" className="text-gray-09 break-keep">
          {title}
        </Typography>
        <Typography variant="me3" className="mt-0.5 text-gray-05 break-keep">
          {description}
        </Typography>
      </div>
    </li>
  );
}

export default function RelationshipGuidePurchaseCard({
  mineNickname,
  friendNickname,
  hasPurchased = false,
  onPurchase,
}: RelationshipGuidePurchaseCardProps) {
  if (hasPurchased) {
    return (
      <section className="border-point rounded-[24px] border bg-gradient-to-b from-white to-[#fff9fc] px-5 py-7 text-center">
        <div className="bg-sub-5 text-sub-4 inline-flex max-w-full rounded-full px-3 py-2 text-[12px] leading-none font-semibold tracking-[-0.48px]">
          <span className="truncate">
            ✦ {mineNickname}님과 {friendNickname}님의 관계 사용법
          </span>
        </div>

        <Typography variant="h1" className="mt-5 text-gray-09 break-keep">
          결제한 맞춤 관계 설명서가 있어요
        </Typography>
        <Typography variant="me3" className="mt-2 text-gray-06 break-keep">
          두 사람만의 관계 흐름과 더 편해지는 방법을 다시 확인해보세요.
        </Typography>

        <button
          type="button"
          onClick={onPurchase}
          className="bg-sub-4 mt-6 flex h-[58px] w-full items-center justify-center rounded-[14px] text-white shadow-[0_10px_22px_rgba(255,58,180,0.18)] transition-opacity hover:opacity-90 active:opacity-80"
        >
          <Typography variant="h2" as="span">
            맞춤 관계 설명서 바로 보기
          </Typography>
        </button>
      </section>
    );
  }

  return (
    <section className="border-point overflow-hidden rounded-[24px] border bg-gradient-to-b from-white to-[#fff9fc] px-5 py-7">
      <div className="bg-sub-5 text-sub-4 inline-flex max-w-full rounded-full px-3 py-2 text-[12px] leading-none font-semibold tracking-[-0.48px]">
        <span className="truncate">
          ✦ {mineNickname}님과 {friendNickname}님의 관계 사용법
        </span>
      </div>

      <Typography variant="h1" className="mt-5 text-gray-09 break-keep">
        그런데 왜 우리는 가끔
        <br />
        <span className="text-sub-4">같은 순간에 엇갈릴까요?</span>
      </Typography>

      <Typography variant="me3" className="mt-3 text-gray-07 break-keep">
        {mineNickname}님과 {friendNickname}님이 함께 있을 때만 보이는 관계의 흐름이 있어요. 서로를
        오해하기 쉬운 순간부터 더 편해지는 방법까지 한 번에 담아드려요.
      </Typography>

      <ul className="mt-6 flex flex-col gap-2">
        {lockedTopics.map((topic) => (
          <LockedTopic key={topic.title} {...topic} />
        ))}
      </ul>

      <ul className="mt-6 flex flex-col gap-5">
        {includedContents.map((content) => (
          <IncludedContent key={content.title} {...content} />
        ))}
      </ul>

      <div className="border-gray-02 mt-7 border-t pt-5">
        <div className="flex items-end justify-between gap-3">
          <Typography variant="me3" className="pb-1 text-gray-06">
            맞춤 관계 설명서
          </Typography>
          <span className="shrink-0 text-[32px] leading-none font-bold tracking-[-1.28px] text-gray-09">
            990원
          </span>
        </div>

        <button
          type="button"
          onClick={onPurchase}
          className="bg-sub-4 mt-5 flex h-[58px] w-full items-center justify-center rounded-[14px] text-white shadow-[0_10px_22px_rgba(255,58,180,0.18)] transition-opacity hover:opacity-90 active:opacity-80"
        >
          <Typography variant="h2" as="span">
            맞춤 관계 설명서 열기
          </Typography>
        </button>

        <Typography variant="me4" className="mt-3 text-center text-gray-04">
          한 번 결제하면 저장된 설명서를 계속 볼 수 있어요
        </Typography>
      </div>
    </section>
  );
}
