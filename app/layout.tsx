import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import { CurrencyProvider } from "@/lib/currency";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast";
import { ThemeProvider } from "@/lib/theme";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  SoftwareApplicationJsonLd,
  ProfessionalServiceJsonLd,
} from "@/components/seo/JsonLd";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { DeviceTracker } from "@/components/analytics/DeviceTracker";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/lib/constants";

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
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: "TestingHub",
  keywords: SITE_KEYWORDS,
  authors: [{ name: "TestingHub QA Team", url: SITE_URL }],
  creator: "TestingHub",
  publisher: "QA.TestingHub",
  generator: "Next.js",

  // ===== IKONKALAR =====
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/images/icon-192.png" },
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
        type: "image/png",
      },
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
        type: "image/png",
      },
    ],
  },

  // ===== TWITTER CARD =====
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image`, `${SITE_URL}/og-image.png`],
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

import { ConsultationModalProvider } from "@/lib/consultation-context";
import { ConsultationModal } from "@/components/modals/ConsultationModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for Telegram (CTA links) */}
        <link rel="dns-prefetch" href="https://t.me" />

        {/* Anti-stale cache directives for WebViews and browser caches */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Critical inline styles for splash screen and instant anti-FOUC */}
        <style
          dangerouslySetInnerHTML={{
            __html: `html.splash-active body{overflow:hidden!important}html.splash-active #app-content{opacity:0!important;pointer-events:none!important}html:not(.splash-active) #testinghub-splash{display:none!important}#testinghub-splash{position:fixed;inset:0;z-index:9999}`,
          }}
        />

        {/* Synchronous theme, splash pre-init & stale SW cleanup — executes before render/paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if("serviceWorker"in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){for(var r of rs){r.unregister();}});};var t=localStorage.getItem("testinghub_theme");var sysDark=window.matchMedia("(prefers-color-scheme: dark)").matches;var isDark=t==="dark"||((!t||t==="system")&&sysDark);if(isDark){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}var seenSession=sessionStorage.getItem("testinghub_tab_seen");var lastSeen=localStorage.getItem("testinghub_splash_last");var isStandalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;var prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var isSeen=seenSession||(isStandalone&&lastSeen&&(Date.now()-parseInt(lastSeen,10)<8*3600*1000));if(!isSeen&&!prefersReducedMotion){document.documentElement.classList.add("splash-active");setTimeout(function(){document.documentElement.classList.remove("splash-active");},3500);}}catch(e){}})();`,
          }}
        />

        {/* Global Structured Data (JSON-LD) for SEO */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <SoftwareApplicationJsonLd />
        <ProfessionalServiceJsonLd />
      </head>
      <body suppressHydrationWarning className="font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary/25 selection:text-foreground">
        <ThemeProvider>
          <I18nProvider>
            <CurrencyProvider>
              <AuthProvider>
                <ToastProvider>
                  <ConsultationModalProvider>
                    <DeviceTracker />
                    <SplashScreen />
                    <ConsultationModal />
                    <div id="app-content" className="relative flex min-h-screen flex-col">
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                  </ConsultationModalProvider>
                </ToastProvider>
              </AuthProvider>
            </CurrencyProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
