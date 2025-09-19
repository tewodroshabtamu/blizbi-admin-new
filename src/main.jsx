import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.tsx";
import i18n from "./i18n.ts";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookmarkProvider } from "./contexts/BookmarkContext.tsx";
import { ConsentProvider } from "./contexts/ConsentContext.tsx";
import ConsentBanner from "./components/privacy/ConsentBanner.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ConsentProvider>
              <BookmarkProvider>
                <App />
                <ConsentBanner />
                <Toaster position="top-right" closeButton richColors />
              </BookmarkProvider>
            </ConsentProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </I18nextProvider>
    </ClerkProvider>
  </StrictMode>
);
