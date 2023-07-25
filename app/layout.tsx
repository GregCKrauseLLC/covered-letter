// Third party
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";

// Local
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Covered Letter",
  description:
    "An AI-driven tool to help you get a quick start on your next cover letter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-SBMG3GMY4J"
      />
      <Script src="/google-analytics.js" />
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
