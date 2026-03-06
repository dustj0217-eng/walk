import type { Metadata, Viewport } from "next";
import SwRegister from "@/public/Swregister";

export const metadata: Metadata = {
  title: "Strolly",
  description: "오늘도 걸어볼까요. 산책 트래킹 앱.",
  applicationName: "Strolly",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Strolly",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-apple.png",
  },
  // og 태그 — 카카오/슬랙 등에서 링크 미리보기
  openGraph: {
    title: "Strolly",
    description: "오늘도 걸어볼까요. 산책 트래킹 앱.",
    url: "https://walk-strolly.vercel.app",
    siteName: "Strolly",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // 앱처럼 핀치줌 막기
  viewportFit: "cover", // 노치/홈바 영역까지
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* PWA iOS standalone 강제 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Strolly" />

        {/* 스플래시 — iPhone 14 Pro 기준 */}
        <link
          rel="apple-touch-startup-image"
          href="/splash-1179x2556.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#fff", overscrollBehavior: "none" }}>
        <SwRegister />
        {children}
      </body>
    </html>
  );
}