declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS;
const isProduction = import.meta.env.MODE === "production";
export const ANALYTICS_CONSENT_KEY = "pakit_analytics_consent";

export const hasAnalyticsConsent = () =>
  window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted";

export const initializeGoogleAnalytics = () => {
  if (!isProduction || !GA_ID || !hasAnalyticsConsent() || window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
};

export const trackPageView = (path: string) => {
  if (!isProduction || !hasAnalyticsConsent()) return;
  initializeGoogleAnalytics();
  window.gtag?.("config", GA_ID, { page_path: path });
};

export const trackEvent = (params: { action: string; category: string; label?: string }) => {
  if (!isProduction || !hasAnalyticsConsent()) return;
  initializeGoogleAnalytics();
  window.gtag?.("event", params.action, {
    event_category: params.category,
    event_label: params.label,
  });
};
