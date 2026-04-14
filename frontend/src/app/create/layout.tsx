"use client";

import { TransitionProvider } from "../login/transition-context";
import { CreateFlowProvider } from "./create-flow-context";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CreateFlowProvider>
      <TransitionProvider>{children}</TransitionProvider>
    </CreateFlowProvider>
  );
}
