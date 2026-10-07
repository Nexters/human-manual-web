/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_MOCK?: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_ANALYTICS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
