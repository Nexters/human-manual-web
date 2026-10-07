import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { authMockEnabled } from "./lib/authMockMode";
import { queryClient } from "./lib/queryClient.ts";

async function bootstrap() {
  if (import.meta.env.DEV && authMockEnabled) {
    const { installAuthMock } = await import("./mocks/authApi");
    installAuthMock();
  }
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}
void bootstrap();
