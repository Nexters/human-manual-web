import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import Typography from "@/components/shared/Typography";

type PolicyPageLayoutProps = {
  title: string;
  effectiveDate: string;
  children: ReactNode;
};

const policyLinks = [
  { to: "/terms", label: "이용약관" },
  { to: "/privacy", label: "개인정보처리방침" },
  { to: "/refund-policy", label: "취소·환불 정책" },
] as const;

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-gray-02 border-b pb-7 last:border-b-0 last:pb-0">
      <Typography variant="h3" className="text-gray-09">
        {title}
      </Typography>
      <div className="mt-3 space-y-3 text-[14px] leading-[1.75] font-medium tracking-[-0.42px] text-gray-07 break-keep">
        {children}
      </div>
    </section>
  );
}

export function PolicyList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5">{children}</ul>;
}

export default function PolicyPageLayout({
  title,
  effectiveDate,
  children,
}: PolicyPageLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-dvh bg-white">
      <TopBar title={title} onBack={handleBack} />
      <article className="px-5 pt-7 pb-10">
        <Typography variant="h1" className="text-gray-09">
          {title}
        </Typography>
        <Typography variant="me3" className="mt-2 text-gray-05">
          시행일: {effectiveDate}
        </Typography>

        <div className="mt-8 space-y-7">{children}</div>

        <nav aria-label="정책 문서" className="border-gray-02 mt-10 border-t pt-6">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {policyLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[13px] leading-5 font-medium tracking-[-0.39px] text-gray-06 underline underline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </article>
    </div>
  );
}
