import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import Y2KLogo from "@/components/y2k-logo";

const vt323 = VT323({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TODO",
  description: "シンプルなTODOアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/todo/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/todo/icon-192x192.png" />
      </head>
      <body className={`${vt323.className} text-lg`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/todo/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
