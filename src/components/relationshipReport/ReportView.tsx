import type { ReactNode } from "react";
import { MotionConfig, motion, type HTMLMotionProps } from "framer-motion";
import Typography from "@/components/shared/Typography";
import { cn } from "@/lib/cn";
import type { CompatibilityPersonOutput } from "@/types/compatibility";
import { splitEmphasis, type ParsedReport } from "@/components/relationshipReport/parseReport";
import sceneDistanceIcon from "@/assets/svgs/relationshipReport/scene-distance.svg";
import sceneTalkIcon from "@/assets/svgs/relationshipReport/scene-talk.svg";
import sceneCareIcon from "@/assets/svgs/relationshipReport/scene-care.svg";
import sceneRhythmIcon from "@/assets/svgs/relationshipReport/scene-rhythm.svg";
import ruleIcon from "@/assets/svgs/relationshipReport/rule.svg";
import tokkiImage from "@/assets/img/relationshipReport/tokki.png";
import tokkiLeaningImage from "@/assets/img/relationshipReport/tokki-leaning.png";

const SCENE_ICONS = [
  sceneDistanceIcon,
  sceneTalkIcon,
  sceneCareIcon,
  sceneRhythmIcon,
  sceneTalkIcon,
];

// 시안의 등장 애니메이션 값
const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;

function FadeUp({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
      {...props}
    />
  );
}

function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

const CARD =
  "rounded-[18px] border border-gray-02/90 bg-white shadow-[0_8px_24px_rgba(25,31,40,0.045)]";

function Rich({ text }: { text: string }) {
  return (
    <>
      {splitEmphasis(text).map((part, i) =>
        part.strong ? (
          <b
            key={i}
            className="text-gray-09 bg-[linear-gradient(transparent_62%,#ffe1f4_62%)] font-bold"
          >
            {part.text}
          </b>
        ) : (
          part.text
        ),
      )}
    </>
  );
}

function Prose({ paragraphs, small }: { paragraphs: string[]; small?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={cn(
            "text-gray-07 font-medium tracking-[-0.35px] break-keep",
            small ? "text-[14px] leading-[1.72]" : "text-[15px] leading-[1.78]",
          )}
        >
          <Rich text={p} />
        </p>
      ))}
    </div>
  );
}

function Section({
  part,
  title,
  subtitle,
  children,
}: {
  part: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section className="flex flex-col gap-[18px] px-4 pt-[42px] pb-1">
        <div className="flex flex-col gap-1 px-1">
          <span className="text-sub-4 text-[12px] font-bold tracking-[0.03em]">{part}</span>
          <h2 className="text-gray-09 text-[24px] leading-[1.35] font-bold tracking-[-0.8px] break-keep">
            {title}
          </h2>
          <p className="text-gray-06 text-[14px] font-medium break-keep">{subtitle}</p>
        </div>
        {children}
      </section>
    </Reveal>
  );
}

// ------- 히어로: 제목 + 두 캐릭터 카드 ------
function Hero({
  mine,
  friend,
}: {
  mine: CompatibilityPersonOutput;
  friend: CompatibilityPersonOutput;
}) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(44%_32%_at_91%_28%,rgba(255,133,209,0.13),transparent_72%),radial-gradient(50%_36%_at_4%_48%,rgba(1,49,255,0.08),transparent_74%),linear-gradient(180deg,#fff_0%,#fff_43%,#f7f8fc_100%)] px-[18px] pt-12 pb-10">
      <div className="px-1.5">
        <FadeUp
          delay={0.1}
          className="text-gray-07 flex items-center gap-2 text-[10px] font-extrabold tracking-[0.15em]"
        >
          <span className="bg-main h-[2px] w-[18px] rounded-[2px]" />
          PAKIT · RELATIONSHIP REPORT
        </FadeUp>
        <FadeUp delay={0.25}>
          <h1 className="text-gray-09 mt-[15px] text-[44px] leading-[1.05] font-extrabold tracking-[-2.2px]">
            우리 둘의
            <br />
            <span className="relative z-0">
              관계 설명서
              <span className="absolute inset-x-[-1px] bottom-[2px] -z-10 h-[9px] rounded-[3px] bg-[linear-gradient(90deg,rgba(255,133,209,0.34),rgba(255,133,209,0.14))]" />
            </span>
          </h1>
          <p className="text-gray-06 mt-[13px] max-w-[320px] text-[14px] leading-[1.6] font-medium break-keep">
            {mine.nickname}님과 {friend.nickname}님의 응답을 나란히 놓고
            <br />두 사람이 잘 맞춰가는 법을 정리했어요.
          </p>
        </FadeUp>
      </div>

      {/* 그라데이션 테두리: 1px 바깥 래퍼에 그라데이션, 안쪽을 흰 카드로 덮는다 */}
      <div className="mt-8 rounded-[26px] bg-[linear-gradient(135deg,rgba(1,49,255,0.22),rgba(255,133,209,0.24))] p-px shadow-[0_18px_50px_rgba(25,31,40,0.07)]">
        <div className="relative isolate h-[250px] rounded-[25px] bg-white bg-[radial-gradient(46%_58%_at_24%_60%,rgba(1,49,255,0.065),transparent_76%),radial-gradient(48%_60%_at_78%_60%,rgba(255,133,209,0.10),transparent_76%)]">
          <FadeUp delay={0.25} className="absolute top-[-96px] right-[10px] z-20">
            <img
              src={tokkiLeaningImage}
              alt=""
              className="h-[100px] w-[104px] object-contain object-bottom drop-shadow-[0_8px_10px_rgba(25,31,40,0.10)]"
            />
          </FadeUp>
          {/* 두 캐릭터 원의 가운데 높이에 맞춘다 */}
          <motion.span
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.3, 1.6, 0.4, 1], delay: 1.2 }}
            className="border-gray-02 absolute top-[86px] left-[calc(50%-14px)] z-10 flex size-7 items-center justify-center rounded-full border bg-white shadow-[0_4px_12px_rgba(25,31,40,0.06)]"
          >
            <svg viewBox="0 0 24 24" className="size-[13px]" aria-hidden>
              <path
                fill="#ff3ab4"
                d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2.1 0 3.7 1.2 4.6 2.6.9-1.4 2.5-2.6 4.6-2.6 3.4 0 5.5 3.4 4 6.8C19.5 16.4 12 21 12 21z"
              />
            </svg>
          </motion.span>

          <div className="absolute inset-x-0 bottom-[5px] flex">
            {[mine, friend].map((person, i) => (
              <motion.div
                key={person.nickname}
                initial={{ opacity: 0, x: i ? 120 : -120 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.2, 1.2, 0.3, 1], delay: 0.55 }}
                className="relative flex w-1/2 flex-col items-center gap-2.5"
              >
                <span className="border-gray-02/90 absolute bottom-[79px] left-1/2 size-[132px] -translate-x-1/2 rounded-full border bg-[rgba(247,248,252,0.88)]" />
                <img
                  src={person.image_url}
                  alt={person.noun}
                  className="relative h-[176px] w-full object-contain px-4 py-2.5 drop-shadow-[0_12px_10px_rgba(25,31,40,0.12)]"
                />
                <span className="border-gray-02 text-gray-09 relative max-w-[128px] min-w-[78px] truncate rounded-full border bg-white px-[13px] py-[7px] text-center text-[12px] font-bold">
                  {person.nickname}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type ReportViewProps = {
  report: ParsedReport;
  mine: CompatibilityPersonOutput;
  friend: CompatibilityPersonOutput;
  footer: ReactNode;
};

// ------- 연인 관계 설명서 본문 ------
export default function ReportView({ report, mine, friend, footer }: ReportViewProps) {
  const { core, scenes, strength, letters, rules, summary } = report;

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-[#f8f9fc]">
        <Hero mine={mine} friend={friend} />

        {summary && (
          <Reveal>
            <div className={cn(CARD, "mx-4 p-5 pt-[22px]")}>
              <div className="mb-2.5 flex items-center gap-2">
                <span className="flex size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fff0f8]">
                  <img
                    src={tokkiImage}
                    alt=""
                    className="h-[34px] w-[26px] translate-y-1 object-contain"
                  />
                </span>
                <span className="text-gray-08 text-[12px] font-extrabold">토키의 한 줄 정리</span>
              </div>
              <p className="text-gray-09 text-[18px] leading-[1.55] font-semibold tracking-[-0.72px] break-keep">
                <Rich text={summary} />
              </p>
            </div>
          </Reveal>
        )}

        {core && (
          <Section part="PART 1" title={core.title} subtitle="두 사람의 관계가 움직이는 기본 패턴">
            <div className={cn(CARD, "px-5 py-[22px]")}>
              <Prose paragraphs={core.paragraphs} />
            </div>
          </Section>
        )}

        {scenes.length > 0 && (
          <Section
            part="PART 2"
            title="우리 사이에 자주 생기는 장면"
            subtitle="갈등이 생기기 쉬운 지점을 장면별로 짚어봤어요"
          >
            <div className="flex flex-col gap-3">
              {scenes.map((scene, i) => (
                <div key={i} className={cn(CARD, "overflow-hidden")}>
                  <div className="flex items-center gap-3.5 p-[18px]">
                    <img
                      src={SCENE_ICONS[i % SCENE_ICONS.length]}
                      alt=""
                      className="size-[42px] shrink-0"
                    />
                    <div>
                      <p className="text-sub-4 text-[11px] font-extrabold tracking-[0.03em]">
                        장면 {i + 1}
                      </p>
                      <Typography
                        variant="sb4"
                        className="text-gray-09 mt-0.5 leading-[1.45] break-keep"
                      >
                        {scene.title}
                      </Typography>
                    </div>
                  </div>
                  <div className="px-[18px] pb-[22px]">
                    <Prose paragraphs={scene.paragraphs} small />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {strength && (
          <Section
            part="PART 3"
            title={strength.title}
            subtitle="둘이라서 더 단단해지는 부분이에요"
          >
            <div className={cn(CARD, "px-5 py-[22px]")}>
              <Prose paragraphs={strength.paragraphs} />
            </div>
          </Section>
        )}

        {letters && letters.items.length > 0 && (
          <Section
            part="PART 4"
            title={letters.title}
            subtitle="서로에게 바로 적용할 수 있는 가이드"
          >
            <div className="flex flex-col gap-3">
              {letters.items.map((letter, i) => (
                <div key={i} className={cn(CARD, "p-[18px]")}>
                  <div className="flex items-center gap-2">
                    <img
                      src={(i % 2 ? friend : mine).image_url}
                      alt=""
                      className="border-gray-02 size-[42px] rounded-full border bg-white object-contain p-1"
                    />
                    <Typography variant="sb4" as="span" className="text-gray-09">
                      {letter.from}
                    </Typography>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-04"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                    <span
                      className={cn(
                        "rounded-full px-[9px] py-1 text-[12px] font-bold",
                        i % 2 ? "text-main bg-[#e8ecff]" : "text-sub-4 bg-sub-5",
                      )}
                    >
                      {letter.to}에게
                    </span>
                  </div>
                  <div className="mt-3.5">
                    <Prose paragraphs={letter.paragraphs} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {rules && rules.items.length > 0 && (
          <Section
            part="PART 5"
            title={rules.title}
            subtitle="두 사람에게 맞게 정리한 현실적인 관계 규칙"
          >
            <div className="flex flex-col gap-3">
              {rules.items.map((rule, i) => (
                <div
                  key={i}
                  className="border-gray-02/90 flex items-start gap-4 rounded-[16px] border bg-white p-4 shadow-[0_6px_18px_rgba(25,31,40,0.035)]"
                >
                  <img src={ruleIcon} alt="" className="size-[34px] shrink-0" />
                  <div>
                    <p className="text-gray-09 text-[15px] leading-[1.5] font-semibold tracking-[-0.6px] break-keep">
                      <Rich text={rule.title} />
                    </p>
                    <p className="text-gray-06 mt-1 text-[13px] leading-[1.6] font-medium tracking-[-0.5px] break-keep">
                      <Rich text={rule.description} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {footer}
      </div>
    </MotionConfig>
  );
}
