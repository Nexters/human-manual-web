import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AccountHeader from "@/components/auth/AccountHeader";
import MyResultModal from "@/components/onboarding/MyResultModal";
import { useModal } from "@/hooks/useModal";
import { useMyResultStore } from "@/stores/myResultStore";
import logo from "@/assets/img/logo.png";
import "./home.css";

export default function SiteHeader({ account = false }: { account?: boolean }) {
  const [visible, setVisible] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { open, close } = useModal();
  const remember = useMyResultStore((s) => s.setResultCode);
  useEffect(() => {
    if (visible) dialog.current?.showModal();
    else dialog.current?.close();
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);
  const load = () => {
    setVisible(false);
    open({
      title: "기존 결과 불러오기",
      contents: (
        <MyResultModal
          onSubmit={(code) => {
            remember(code);
            close();
            navigate(`/result/${encodeURIComponent(code)}`);
          }}
        />
      ),
    });
  };
  const links = [
    ["/", "홈"],
    ["/?start=1", "테스트 시작하기"],
    ["/my/results", "내 보관함"],
    ["/my/compatibilities", "친구와의 케미"],
    ["/my/premium", "프리미엄 결과"],
    ["/my/payments", "결제 내역"],
    ["/support", "문의하기"],
  ];
  const menuButton = (
    <button className="pakit-icon" aria-label="메뉴 열기" onClick={() => setVisible(true)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
  return (
    <>
      {account ? (
        <AccountHeader menu={menuButton} showAuth={false} />
      ) : (
        <header className="pakit-header">
          <Link to="/" aria-label="Pakit 홈">
            <img src={logo} alt="Pakit" />
          </Link>
          {menuButton}
        </header>
      )}
      <dialog
        ref={dialog}
        className="pakit-drawer"
        onCancel={() => setVisible(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setVisible(false);
        }}
      >
        <div className="pakit-drawer-inner">
          <div className="pakit-drawer-head">
            <img src={logo} alt="Pakit" />
            <button className="pakit-icon" aria-label="메뉴 닫기" onClick={() => setVisible(false)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <nav aria-label="전체 메뉴" className="pakit-menu-links">
            {links.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                aria-current={location.pathname === to ? "page" : undefined}
                onClick={() => setVisible(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button className="pakit-import" onClick={load}>
            기존 결과 불러오기
          </button>
          <div className="pakit-menu-policies">
            <Link to="/terms" onClick={() => setVisible(false)}>
              이용약관
            </Link>
            <Link to="/privacy" onClick={() => setVisible(false)}>
              개인정보처리방침
            </Link>
            <Link to="/refund-policy" onClick={() => setVisible(false)}>
              취소·환불 정책
            </Link>
          </div>
          <div className="pakit-menu-account">
            <AccountHeader showTabs={false} />
          </div>
        </div>
      </dialog>
    </>
  );
}
