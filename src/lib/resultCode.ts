// OpenAPI 의 AssessmentSubmissionOutput.result_code 제약: URL-safe 8자.
const RESULT_CODE_LENGTH = 8;
const RESULT_CODE_PATTERN = new RegExp(`^[A-Za-z0-9_-]{${RESULT_CODE_LENGTH}}$`);

export function isResultCode(value: string | null | undefined): value is string {
  return Boolean(value) && RESULT_CODE_PATTERN.test(value as string);
}

/**
 * 링크로 받은 값에서 결과 코드만 떼어낸다.
 * 공유 문구가 뒤에 눌러붙어 넘어오는 경우가 있어, 길이가 고정된 앞 8자만 보고 판정한다.
 */
export function takeResultCode(value: string | null | undefined): string | null {
  const code = value?.slice(0, RESULT_CODE_LENGTH);
  return isResultCode(code) ? code : null;
}
