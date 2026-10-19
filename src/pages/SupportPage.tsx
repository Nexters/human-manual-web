import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/home/SiteHeader";

const topics = [
  {
    title: "결제·환불 문의",
    description: "결제 오류, 중복 결제, 환불 요청",
    mark: "₩",
    guide:
      "결제 일시, 상품명, 주문번호와 함께 문의 내용을 알려주세요. 카드번호 등 결제정보 전체는 보내지 마세요.",
  },
  {
    title: "결과 이용 문의",
    description: "결과 조회, 결과 코드, 계정 연결",
    mark: "?",
    guide: "결과 코드와 문제가 발생한 화면을 알려주세요. 비밀번호 등 민감한 정보는 보내지 마세요.",
  },
];
export default function SupportPage() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="pakit-support">
      <SiteHeader />
      <section className="pakit-support-body">
        <p className="pakit-kicker">고객지원</p>
        <h1>무엇을 도와드릴까요?</h1>
        <p className="pakit-support-description">
          Pakit을 이용하다 궁금한 점이 생겼나요?
          <br />
          문의할 내용을 선택해 주세요.
        </p>
        <div className="pakit-support-topics">
          {topics.map((topic, i) => (
            <button
              key={topic.title}
              aria-expanded={selected === i}
              className={selected === i ? "selected" : ""}
              onClick={() => setSelected(selected === i ? null : i)}
            >
              <span>
                <strong>{topic.title}</strong>
                <small>{topic.description}</small>
              </span>
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
        {selected !== null && (
          <div className="pakit-support-guide">
            <strong>{topics[selected].title}</strong>
            <p>
              <a href="mailto:pakit2027@gmail.com">pakit2027@gmail.com</a>
            </p>
            {selected === 0 && <Link to="/refund-policy">취소·환불 정책 확인하기</Link>}
          </div>
        )}
      </section>
    </div>
  );
}
