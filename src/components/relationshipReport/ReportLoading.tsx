import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { CompatibilityPersonOutput } from "@/types/compatibility";
import tokkiStandingImage from "@/assets/img/relationshipReport/tokki-standing.png";
import {
  LOADING_ACCENT_WORDS,
  LOADING_QUESTIONS,
} from "@/components/relationshipReport/loadingQuestions";

const QUESTION_INTERVAL_MS = 2400;

const randomIndex = (except: number) => {
  let next = except;
  while (next === except) next = Math.floor(Math.random() * LOADING_QUESTIONS.length);
  return next;
};

function Question({ text }: { text: string }) {
  const word = LOADING_ACCENT_WORDS.find((w) => text.includes(w));
  if (!word) return <>{text}</>;
  const at = text.indexOf(word);
  return (
    <>
      {text.slice(0, at)}
      <span className="text-[#ff4fa4]">{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}

function ToyBubble({
  person,
  side,
}: {
  person?: CompatibilityPersonOutput;
  side: "left" | "right";
}) {
  return (
    <div
      className={`absolute top-[78px] z-[3] grid size-[181px] place-items-center rounded-full border border-[#f5dce9] bg-[linear-gradient(145deg,#fff,#fff0f8)] shadow-[inset_8px_9px_16px_rgba(255,255,255,0.9),inset_-7px_-8px_16px_rgba(255,160,205,0.08),0_18px_32px_rgba(255,74,164,0.07)] ${side === "left" ? "left-0" : "right-0"}`}
    >
      <span className="absolute top-[19px] left-7 h-[30px] w-[70px] -rotate-[18deg] rounded-full bg-white/65 blur-[5px]" />
      {person && (
        <img
          src={person.image_url}
          alt={person.noun}
          className="relative z-[2] size-[108px] object-contain"
        />
      )}
    </div>
  );
}

// ------- 설명서 생성 중 화면 ------
export default function ReportLoading({
  mine,
  friend,
}: {
  mine?: CompatibilityPersonOutput;
  friend?: CompatibilityPersonOutput;
}) {
  const [index, setIndex] = useState(() => randomIndex(-1));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex(randomIndex), QUESTION_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-1 flex-col items-center px-5 pt-[104px] pb-10 text-center">
        <div className="relative mb-[46px] h-[264px] w-[344px] shrink-0">
          <span className="absolute -top-3 left-1/2 h-[205px] w-[290px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,96,172,0.12),rgba(255,96,172,0)_70%)] blur-[5px]" />
          {/* 두 원 뒤에 서서 앞발과 가방만 원 사이로 보이게 둔다 */}
          <div className="absolute top-[-74px] left-[73px] z-[1] w-[190px] drop-shadow-[0_8px_12px_rgba(25,31,40,0.07)]">
            <motion.img
              src={tokkiStandingImage}
              alt=""
              animate={{ y: [2, -3, 2] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
              className="w-full"
            />
          </div>

          <ToyBubble person={mine} side="left" />
          <ToyBubble person={friend} side="right" />

          <span className="absolute top-[151px] left-[calc(50%-22px)] z-[8] grid size-11 place-items-center rounded-full bg-white/85 shadow-[0_6px_15px_rgba(255,79,164,0.11)]">
            <motion.svg
              viewBox="0 0 24 24"
              className="size-[22px]"
              animate={{ scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
              aria-hidden
            >
              <path
                fill="#ff4fa4"
                d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2.1 0 3.7 1.2 4.6 2.6.9-1.4 2.5-2.6 4.6-2.6 3.4 0 5.5 3.4 4 6.8C19.5 16.4 12 21 12 21z"
              />
            </motion.svg>
          </span>
        </div>

        <div className="grid h-[90px] w-full place-items-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.34, ease: [0.2, 0.8, 0.2, 1] },
              }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.26 } }}
              className="text-gray-09 max-w-[345px] text-[27px] leading-[1.38] font-extrabold tracking-[-1.2px] break-keep"
            >
              <Question text={LOADING_QUESTIONS[index]} />
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="mt-[23px] flex h-3.5 items-center gap-[9px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.i
              key={i}
              animate={{ opacity: [0.3, 1, 0.3, 0.3], scale: [0.9, 1.12, 0.9, 0.9] }}
              transition={{
                duration: 1.15,
                times: [0, 0.3, 0.6, 1],
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.16,
              }}
              className={`size-2 rounded-full ${i ? "bg-[#ffd1e5]" : "bg-[#ff4fa4]"}`}
            />
          ))}
        </div>

        <p className="text-gray-05 mt-6 text-[14px] leading-[1.65] tracking-[-0.45px]">
          두 사람의 응답을 비교하고 있어요.
          <br />
          조금만 기다려주세요.
        </p>
        <p className="mt-auto pt-6 text-[11px] font-semibold text-[#b7bec6]">
          처음 만들 땐 1분 정도 걸릴 수 있어요.
        </p>
      </div>
    </MotionConfig>
  );
}
