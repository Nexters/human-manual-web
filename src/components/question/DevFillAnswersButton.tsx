import { useNavigate } from "react-router-dom";
import Typography from "@/components/shared/Typography";
import { IDENTIFIERS } from "@/constants/assessment";
import { TOTAL_STEPS } from "@/constants/questions";
import { useTestStore } from "@/stores/testStore";
import { MBTI_AXES } from "@/types/assessment";
import type { AnswerValue, MbtiSelection } from "@/types/assessment";

/**
 * 개발 중 문항을 일일이 고르지 않고 마지막 화면까지 건너뛰기 위한 버튼.
 * QuestionLayout 에서 import.meta.env.DEV 로 감싸 렌더하므로 운영 번들에는 들어가지 않는다.
 */
const DevFillAnswersButton = () => {
  const navigate = useNavigate();

  const fillAll = () => {
    // 계약(identifiers)이 문항 순서와 선택지 순서의 기준이라 여기서 첫 값을 가져온다.
    const answers: Record<string, AnswerValue> = {};
    for (const question of IDENTIFIERS.questions) {
      if (question.values?.length) answers[question.question_id] = question.values[0];
      else if (question.constraints) answers[question.question_id] = question.constraints.minimum;
    }

    const mbti: MbtiSelection = {};
    for (const axis of MBTI_AXES) {
      mbti[axis.key] = axis.poles[0];
    }

    useTestStore.setState({ answers, mbti });
    navigate(`/test/${TOTAL_STEPS}`);
  };

  return (
    <button type="button" onClick={fillAll} className="text-gray-04">
      <Typography variant="me3" as="span">
        답변 건너뛰기
      </Typography>
    </button>
  );
};

export default DevFillAnswersButton;
