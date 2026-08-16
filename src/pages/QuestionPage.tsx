import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ActionQuestion from "@/components/question/ActionQuestion";
import CarouselChoiceQuestion from "@/components/question/CarouselChoiceQuestion";
import ChoiceQuestion from "@/components/question/ChoiceQuestion";
import IntegerQuestion from "@/components/question/IntegerQuestion";
import MbtiSelector from "@/components/question/MbtiSelector";
import QuestionCtaButton from "@/components/question/QuestionCtaButton";
import QuestionLayout from "@/components/question/QuestionLayout";
import ResetConfirmModal from "@/components/question/ResetConfirmModal";
import ScaleQuestion from "@/components/question/ScaleQuestion";
import Typography from "@/components/shared/Typography";
import { fillNickname, getQuestion, TOTAL_STEPS } from "@/constants/questions";
import { buildSubmission, submitAssessment, SubmissionValidationError } from "@/api/submission";
import {
  canEnterOrder,
  findFirstIncompleteOrder,
  toMbtiString,
  useTestStore,
} from "@/stores/testStore";

const parseOrder = (raw: string | undefined): number | null => {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) ? parsed : null;
};

const QuestionPage = () => {
  const { number } = useParams();
  const navigate = useNavigate();

  const nickname = useTestStore((state) => state.nickname);
  const answers = useTestStore((state) => state.answers);
  const mbti = useTestStore((state) => state.mbti);
  const setAnswer = useTestStore((state) => state.setAnswer);
  const clearAnswer = useTestStore((state) => state.clearAnswer);
  const setMbtiAxis = useTestStore((state) => state.setMbtiAxis);
  const setResultCode = useTestStore((state) => state.setResultCode);
  const reset = useTestStore((state) => state.reset);

  const [resetOpen, setResetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [carousel, setCarousel] = useState({ questionId: "", index: 0 });

  const order = parseOrder(number);
  const question = order === null ? undefined : getQuestion(order);

  const pressed =
    question?.kind === "action" && answers[question.questionId] === question.pressValue;

  if (!nickname) {
    return <Navigate to="/" replace />;
  }

  if (order === null || !question || !canEnterOrder(order, answers, mbti)) {
    return <Navigate to={`/test/${findFirstIncompleteOrder(answers, mbti)}`} replace />;
  }

  const carouselIndex =
    carousel.questionId === question.questionId
      ? carousel.index
      : question.kind === "carousel"
        ? Math.max(
            0,
            question.options.findIndex((option) => option.value === answers[question.questionId]),
          )
        : 0;

  const maxOrder = findFirstIncompleteOrder(answers, mbti);
  const handleSeek = (next: number) => {
    if (next === order) return;
    navigate(`/test/${next}`, { replace: true });
  };

  const goNext = () => {
    if (order < TOTAL_STEPS) navigate(`/test/${order + 1}`);
  };

  const goBack = () => {
    if (question.kind === "action" && pressed) {
      setAnswer(question.questionId, question.skipValue);
      return;
    }
    navigate(order > 1 ? `/test/${order - 1}` : "/");
  };

  const handleReset = () => {
    reset();
    setResetOpen(false);
    navigate("/test/1");
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await submitAssessment(buildSubmission({ nickname, answers, mbti }));
      setResultCode(result.result_code);
      navigate("/unboxing");
    } catch (error) {
      setSubmitError(
        error instanceof SubmissionValidationError
          ? error.reasons.join("\n")
          : "제출에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const rawTitle = question.kind === "action" && pressed ? question.pressedTitle : question.title;
  const title = fillNickname(rawTitle, nickname);

  const renderBody = () => {
    switch (question.kind) {
      case "choice":
        return (
          <ChoiceQuestion
            questionId={question.questionId}
            layout={question.layout}
            options={question.options}
            value={answers[question.questionId] as string | undefined}
            onChange={(value) => setAnswer(question.questionId, value)}
          />
        );
      case "carousel":
        return (
          <CarouselChoiceQuestion
            options={question.options}
            index={carouselIndex}
            onIndexChange={(next) => setCarousel({ questionId: question.questionId, index: next })}
          />
        );
      case "scale":
        return (
          <ScaleQuestion
            questionId={question.questionId}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
            value={answers[question.questionId] as number | undefined}
            onChange={(value) => setAnswer(question.questionId, value)}
          />
        );
      case "integer":
        return (
          <IntegerQuestion
            questionId={question.questionId}
            value={answers[question.questionId] as number | undefined}
            onChange={(value) => {
              if (value === undefined) clearAnswer(question.questionId);
              else setAnswer(question.questionId, value);
            }}
          />
        );
      case "action":
        return (
          <ActionQuestion
            questionId={question.questionId}
            bubble={question.bubble}
            pressed={pressed}
            onPress={() => setAnswer(question.questionId, question.pressValue)}
          />
        );
      case "mbti":
        return <MbtiSelector value={mbti} onChange={setMbtiAxis} />;
    }
  };

  const renderFooter = () => {
    if (question.kind === "action") {
      return (
        <QuestionCtaButton
          onClick={() => {
            if (!pressed) setAnswer(question.questionId, question.skipValue);
            goNext();
          }}
        >
          {pressed ? question.nextLabel : question.skipLabel}
        </QuestionCtaButton>
      );
    }

    if (question.kind === "carousel") {
      const active = question.options[carouselIndex];
      return (
        <QuestionCtaButton
          tone={question.ctaTone ?? "main"}
          onClick={() => {
            setAnswer(question.questionId, active.value);
            goNext();
          }}
        >
          {active.ctaLabel}
        </QuestionCtaButton>
      );
    }

    if (question.kind === "mbti") {
      return (
        <div>
          {submitError && (
            <Typography variant="me4" className="mb-2 whitespace-pre-line text-red-500">
              {submitError}
            </Typography>
          )}
          <QuestionCtaButton disabled={!toMbtiString(mbti) || submitting} onClick={handleSubmit}>
            {submitting ? "제출 중..." : "장난감 배송하기"}
          </QuestionCtaButton>
        </div>
      );
    }

    return (
      <QuestionCtaButton disabled={answers[question.questionId] === undefined} onClick={goNext}>
        다음
      </QuestionCtaButton>
    );
  };

  return (
    <>
      <QuestionLayout
        order={order}
        title={title}
        hint={question.kind === "scale" ? question.hint : undefined}
        background={
          question.kind === "carousel"
            ? (question.background ?? "white")
            : question.kind === "choice"
              ? (question.background ?? "gray")
              : "gray"
        }
        titleAlign={
          question.kind === "mbti" || (question.kind === "action" && pressed) ? "center" : "left"
        }
        onSeek={handleSeek}
        maxOrder={maxOrder}
        onBack={goBack}
        onReset={() => setResetOpen(true)}
        footer={renderFooter()}
      >
        {renderBody()}
      </QuestionLayout>

      <ResetConfirmModal
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={handleReset}
      />
    </>
  );
};

export default QuestionPage;
