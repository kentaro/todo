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
  const basePath = process.env.NODE_ENV === 'production' ? '/todo' : '';

  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('${basePath}/sw.js').then(
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
      </head>
      <body className={vt323.className}>
        <header className="flex items-center justify-center p-4">
          <Y2KLogo />
        </header>
        {children}
      </body>
    </html>
  );
}
