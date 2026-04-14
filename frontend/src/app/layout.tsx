import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Agentation } from "agentation";
import { DialRoot } from "dialkit";
import "./dialkit.css";
import "./globals.css";
import Script from 'next/script'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paids Design System",
  description: "Paids Design System — Zagreb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} text-[length:var(--text-base)] antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
          {process.env.NODE_ENV === "development" && <Agentation />}
          {process.env.NODE_ENV === "development" && <DialRoot position="bottom-right" />}
        </ThemeProvider>
      </body>
    </html>
  );
}
