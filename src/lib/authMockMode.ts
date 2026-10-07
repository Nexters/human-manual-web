/** 명시적으로 켠 Vite 개발 서버에서만 동작하며 운영 빌드에서는 항상 false다. */
export const authMockEnabled = import.meta.env.DEV && import.meta.env.VITE_AUTH_MOCK === "true";
export const MOCK_SESSION_KEY = "pakit-auth-mock-session";
