"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloudArrowUp, File, X, CheckCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateFlow } from "../create-flow-context";

export default function CreateInputPage() {
  const { data, update, exportJSON } = useCreateFlow();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [exported, setExported] = useState(false);

  const handleFile = useCallback(
    (file: globalThis.File) => {
      update({ fileName: file.name });
    },
    [update]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleGenerate = () => {
    const json = exportJSON();

    // Log to console for backend integration
    console.log("=== CREATE FLOW EXPORT ===");
    console.log(json);

    // Download as JSON file
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "create-flow-data.json";
    a.click();
    URL.revokeObjectURL(url);

    setExported(true);

    // Navigate to editor after a brief moment
    setTimeout(() => {
      router.push("/create/editor");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-lg flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Describe your presentation
          </h1>
          <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            Write a prompt and optionally upload a reference file.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Prompt */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Prompt</Label>
            <textarea
              placeholder="e.g., A pitch deck for a solar energy startup targeting Series A investors, focusing on market opportunity, product differentiation, and financial projections."
              value={data.prompt}
              onChange={(e) => update({ prompt: e.target.value })}
              className="w-full h-[160px] resize-none rounded-[var(--radius-xl)] border border-border-secondary bg-bg-elevated p-4 text-[length:var(--text-md)] leading-[var(--leading-body)] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-brand transition-colors"
            />
          </div>

          {/* File upload */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">
              Reference file{" "}
              <span className="font-normal text-text-tertiary">(optional)</span>
            </Label>
            {data.fileName ? (
              <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border-secondary bg-bg-elevated px-4 py-3">
                <File className="size-5 shrink-0 text-text-secondary" weight="duotone" />
                <span className="flex-1 truncate text-[length:var(--text-base)] text-text-primary">
                  {data.fileName}
                </span>
                <button
                  type="button"
                  onClick={() => update({ fileName: null })}
                  className="shrink-0 rounded-[var(--radius-sm)] p-1 text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text-primary"
                  aria-label="Remove file"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-xl)] border-2 border-dashed transition-colors ${
                  isDragOver
                    ? "border-border-brand bg-bg-brand-secondary"
                    : "border-border-secondary hover:border-border-primary"
                }`}
              >
                <CloudArrowUp
                  className="size-7 text-text-tertiary"
                  weight="light"
                />
                <p className="text-[length:var(--text-xs)] leading-[var(--leading-body)] text-text-tertiary">
                  Drop a file or{" "}
                  <span className="font-medium text-text-brand">browse</span>
                  {" "}&middot; .pptx, .pdf, .docx, .key
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pptx,.pdf,.docx,.key"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <Button variant="tertiary" size="md" asChild>
            <Link href="/create">Back</Link>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerate}
            disabled={exported}
          >
            {exported ? (
              <>
                <CheckCircle weight="bold" />
                Exported
              </>
            ) : (
              "Generate presentation"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
