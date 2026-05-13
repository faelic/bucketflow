import type { Metadata } from "next";
import localFont from "next/font/local";

import { AppProviders } from "@/components/shared/AppProviders";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistLatin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoLatin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BucketFlow",
  description:
    "Stablecoin income infrastructure for freelancers who want to organize payments into real-life priorities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
