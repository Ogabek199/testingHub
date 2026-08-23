import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth-context";

import { ToastProvider } from "@/lib/toast";

export const metadata: Metadata = {
  title: {
    default: "QA.TestingHub — Professional QA Testing Platform",
    template: "%s | QA.TestingHub",
  },
  description:
    "Professional QA va dasturiy ta'minot sinov xizmati. Dasturiy ta'minotingizdagi kritik xatolarni foydalanuvchilarga yetib bormasdan toping.",
  keywords: ["qa testing", "software testing", "test automation", "qa academy", "uzbekistan testing", "istqb"],
  authors: [{ name: "TestingHub QA Team" }],
  creator: "TestingHub",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "QA.TestingHub — Professional QA Testing Platform",
    description: "Professional QA va dasturiy ta'minot sinov xizmati",
    type: "website",
    locale: "uz_UZ",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("testinghub_theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans min-h-screen bg-background text-foreground antialiased selection:bg-coral-500/20 selection:text-coral-900 dark:selection:text-coral-200">
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
