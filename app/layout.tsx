import type { Metadata } from "next";
import { Roboto } from "next/font/google";

// Local
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "CoveredLetter",
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
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
