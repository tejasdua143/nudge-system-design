"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, Copy } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTransitionParams } from "../transition-context";

const API_KEY = "pai-27912873123-hsai8y212391287-1237";

const CODE_LINES = [
  'curl -X POST https://developers.presentations.ai/api/v1/topic/document \\',
  '  -H "Authorization: Bearer YOUR_API_KEY_HERE" \\',
  '  -H "Content-Type: application/json" \\',
  "  -d '{",
  '    "topic": "AI in Healthcare: Transforming Patient Care",',
  '    "slideCount": 6,',
  '    "language": "en",',
  '    "domain": "presentations.ai",',
  '    "exportType": "ppt"',
  "  }'",
];

export default function ApiKeyPage() {
  const [keyCopied, setKeyCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const router = useRouter();
  const { triggerDismiss } = useTransitionParams();

  const copyToClipboard = (text: string, type: "key" | "code") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 2000);
    } else {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-sm flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <Key className="size-8 text-text-brand" weight="duotone" />
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Make your first API call
          </h1>
          <p className="max-w-[280px] text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            Create a project and generate a key to make your first API call.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5">
          {/* API Key field */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">My test key</Label>
            <InputGroup>
              <InputGroupInput
                readOnly
                value={API_KEY}
                className="text-text-tertiary"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="tertiary"
                  size="xs"
                  onClick={() => copyToClipboard(API_KEY, "key")}
                >
                  <Copy className="size-3" />
                  {keyCopied ? "Copied" : "Copy"}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Code snippet */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">
              Try out your new API key
            </Label>
            <div className="relative overflow-hidden rounded-lg border border-border-tertiary bg-bg-secondary p-3">
              <div className="flex gap-3 overflow-x-auto">
                {/* Line numbers */}
                <div className="flex flex-col font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-text-tertiary select-none">
                  {CODE_LINES.map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                {/* Code */}
                <pre className="font-mono text-[length:var(--text-xs)] leading-[var(--leading-body)] text-text-primary">
                  {CODE_LINES.map((line, i) => {
                    const isString =
                      line.includes('"Authorization') ||
                      line.includes('"Content-Type') ||
                      line.includes("'{") ||
                      (i >= 4 && i <= 8) ||
                      line.includes("}'");
                    return (
                      <div key={i}>
                        {isString ? (
                          <span className="text-green-700">{line}</span>
                        ) : (
                          line
                        )}
                      </div>
                    );
                  })}
                </pre>
              </div>
              {/* Copy button */}
              <Button
                variant="tertiary"
                size="icon-xs"
                onClick={() => copyToClipboard(CODE_LINES.join("\n"), "code")}
                className="absolute bottom-2 right-2"
              >
                <Copy className="size-3" />
              </Button>
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => triggerDismiss(() => router.push("/developer"))}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
