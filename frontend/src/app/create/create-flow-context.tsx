"use client";

import { createContext, useContext, useState, useCallback } from "react";

export interface CreateFlowData {
  name: string;
  email: string;
  role: string;
  prompt: string;
  fileName: string | null;
}

interface CreateFlowContextValue {
  data: CreateFlowData;
  update: (partial: Partial<CreateFlowData>) => void;
  exportJSON: () => string;
}

const DEFAULT_DATA: CreateFlowData = {
  name: "",
  email: "",
  role: "",
  prompt: "",
  fileName: null,
};

const CreateFlowContext = createContext<CreateFlowContextValue | null>(null);

export function CreateFlowProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CreateFlowData>(DEFAULT_DATA);

  const update = useCallback((partial: Partial<CreateFlowData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const exportJSON = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  return (
    <CreateFlowContext.Provider value={{ data, update, exportJSON }}>
      {children}
    </CreateFlowContext.Provider>
  );
}

export function useCreateFlow() {
  const ctx = useContext(CreateFlowContext);
  if (!ctx) throw new Error("useCreateFlow must be used within CreateFlowProvider");
  return ctx;
}
