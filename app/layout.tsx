import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import { CurrencyProvider } from "@/lib/currency";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  SoftwareApplicationJsonLd,
  ProfessionalServiceJsonLd,
} from "@/components/seo/JsonLd";
import { SplashScreen } from "@/components/ui/SplashScreen";

const SITE_URL = "https://testinghub.uz";
const SITE_NAME = "QA.TestingHub";
const SITE_DESCRIPTION =
  "Professional QA va dasturiy ta'minot sinov xizmati. Dasturiy ta'minotingizdagi kritik xatolarni foydalanuvchilarga yetib bormasdan toping. O'zbekistonning #1 QA testing platformasi.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#15192e" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ===== ASOSIY META =====
  title: {
    default: "QA.TestingHub — Professional QA Testing Platform | O'zbekiston",
    template: "%s | QA.TestingHub",
  },
  description: SITE_DESCRIPTION,
  applicationName: "TestingHub",
  keywords: [
    "qa testing",
    "software testing",
    "test automation",
    "qa academy",
    "uzbekistan testing",
    "istqb",
    "istqb uzbekistan",
    "dasturiy ta'minot sinovi",
    "QA xizmati",
    "bug topish",
    "test avtomatizatsiya",
    "playwright test",
    "cypress test",
    "selenium testing",
    "manual testing",
    "api testing",
    "security testing",
    "penetration testing uzbekistan",
    "performance testing",
    "load testing",
    "mobile app testing",
    "ios app testing",
    "android app testing",
    "O'zbekiston QA",
    "Toshkent QA xizmati",
    "dasturchi xizmati",
    "sayt test qilish",
    "ilova test qilish",
    "regression testing",
    "smoke testing",
    "qa tester",
    "qa muhandis",
    "testinghub",
    "testinghub uz",
    "testing hub uzbekistan",
    "тестирование по узбекистан",
    "qa услуги ташкент",
    "автоматизация тестирования",
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
    title: "QA.TestingHub — Professional QA Testing Platform | O'zbekiston",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QA.TestingHub — Professional QA Testing Platform",
        type: "image/png",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QA.TestingHub — Professional QA Testing Platform",
        type: "image/png",
      },
    ],
  },

  // ===== TWITTER CARD =====
  twitter: {
    card: "summary_large_image",
    title: "QA.TestingHub — Professional QA Testing Platform | O'zbekiston",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image", "/og-image.png"],
    creator: "@testinghub",
    site: "@testinghub",
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },

  // ===== ALTERNATE LANGUAGES =====
  alternates: {
    canonical: SITE_URL,
    languages: {
      "uz-UZ": SITE_URL,
      "ru-RU": `${SITE_URL}?lang=ru`,
      "en-US": `${SITE_URL}?lang=en`,
      "x-default": SITE_URL,
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
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for Telegram (CTA links) */}
        <link rel="dns-prefetch" href="https://t.me" />

        {/* Global Structured Data (JSON-LD) for SEO */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <SoftwareApplicationJsonLd />
        <ProfessionalServiceJsonLd />
      </head>
      <body className="font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary/25 selection:text-foreground">
        {/* Dark mode init — must run before paint */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("testinghub_theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
        <I18nProvider>
          <CurrencyProvider>
            <AuthProvider>
              <ToastProvider>
                <SplashScreen />
                <div className="relative flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </ToastProvider>
            </AuthProvider>
          </CurrencyProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
