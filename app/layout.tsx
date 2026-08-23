import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth-context";

import { ToastProvider } from "@/lib/toast";

const SITE_URL = "https://testinghub.uz";
const SITE_NAME = "QA.TestingHub";
const SITE_DESCRIPTION =
  "Professional QA va dasturiy ta'minot sinov xizmati. Dasturiy ta'minotingizdagi kritik xatolarni foydalanuvchilarga yetib bormasdan toping. O'zbekistonning #1 QA testing platformasi.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#09090C" },
  ],
};

export const metadata: Metadata = {
  // ===== ASOSIY META =====
  title: {
    default: "QA.TestingHub — Professional QA Testing Platform | O'zbekiston",
    template: "%s | QA.TestingHub",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "qa testing",
    "software testing",
    "test automation",
    "qa academy",
    "uzbekistan testing",
    "istqb",
    "dasturiy ta'minot sinovi",
    "QA xizmati",
    "bug topish",
    "test avtomatizatsiya",
    "manual testing",
    "api testing",
    "security testing",
    "performance testing",
    "mobile app testing",
    "O'zbekiston QA",
    "dasturchi xizmati",
    "sayt test",
    "ilova test",
    "regression testing",
    "smoke testing",
    "qa tester",
    "qa muhandis",
    "testinghub",
    "testing hub uzbekistan",
  ],
  authors: [{ name: "TestingHub QA Team", url: SITE_URL }],
  creator: "TestingHub",
  publisher: "QA.TestingHub",
  generator: "Next.js",

  // ===== IKONKALAR =====
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg" },
    ],
  },

  // ===== MANIFEST =====
  manifest: "/manifest.json",

  // ===== OPEN GRAPH (Facebook, Telegram, LinkedIn) =====
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "QA.TestingHub — Professional QA Testing Platform",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/favicon.svg`,
        width: 512,
        height: 512,
        alt: "QA.TestingHub Logo",
        type: "image/svg+xml",
      },
    ],
  },

  // ===== TWITTER CARD =====
  twitter: {
    card: "summary_large_image",
    title: "QA.TestingHub — Professional QA Testing Platform",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/favicon.svg`],
    creator: "@testinghub",
  },

  // ===== ROBOTS =====
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ===== VERIFICATION =====
  // Google Search Console, Yandex Webmaster - kerak bo'lganda qo'shing
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },

  // ===== ALTERNATE LANGUAGES =====
  alternates: {
    canonical: SITE_URL,
    languages: {
      "uz-UZ": SITE_URL,
      "ru-RU": `${SITE_URL}?lang=ru`,
      "en-US": `${SITE_URL}?lang=en`,
    },
  },

  // ===== CATEGORIYA =====
  category: "technology",

  // ===== QIDIRUV ANNOTATSIYALARI =====
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "TestingHub",
    "format-detection": "telephone=no",
    "msapplication-TileColor": "#FF6B47",
    "msapplication-config": "none",
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
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for Telegram (CTA links) */}
        <link rel="dns-prefetch" href="https://t.me" />
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
