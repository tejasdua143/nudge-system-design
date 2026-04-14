"use client";

import { TransitionProvider } from "./transition-context";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TransitionProvider>{children}</TransitionProvider>;
}
