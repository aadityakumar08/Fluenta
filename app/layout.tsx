import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fluenta — Speak English with Confidence",
  description:
    "AI-powered spoken English practice. Have real conversations, get instant feedback, and build confidence. Free to start.",
  keywords: [
    "English speaking practice",
    "AI conversation partner",
    "spoken English",
    "language learning",
    "fluency training",
  ],
  openGraph: {
    title: "Fluenta — Speak English with Confidence",
    description:
      "AI that listens, responds, and helps you speak English with confidence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain-overlay">{children}</body>
    </html>
  );
}
