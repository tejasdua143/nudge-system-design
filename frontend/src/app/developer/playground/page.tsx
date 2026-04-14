"use client";

import {
  Code,
  Ruler,
  Translate,
  ChatDots,
  UsersFour,
  Globe,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function PlaygroundPage() {
  return (
      <main className="flex flex-1 flex-col overflow-hidden rounded-xl bg-bg-primary shadow-elevation-3">
        {/* Header */}
        <div className="flex h-[63px] items-center justify-between border-b border-border-secondary px-6">
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Playground
          </h1>
          <Button variant="tertiary" size="sm">
            <Code weight="regular" className="size-5" />
            Get the code
          </Button>
        </div>

        {/* Two-column content */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Left: Form ──────────────────────────────────────────── */}
          <div className="flex w-[480px] shrink-0 flex-col border-r border-border-tertiary p-6">
            <div className="flex flex-col gap-6">
              {/* Form fields */}
              <div className="flex flex-col gap-4">
                {/* API end points */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <Code weight="duotone" className="size-5 shrink-0 text-text-tertiary" />
                    <span className="text-[length:var(--text-base)] text-text-secondary">API end points</span>
                  </div>
                  <Select defaultValue="topic">
                    <SelectTrigger className="w-[232px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="topic">Create from topic</SelectItem>
                      <SelectItem value="file">Create from file</SelectItem>
                      <SelectItem value="single">Single slide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Slide count */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <Ruler weight="duotone" className="size-5 shrink-0 text-text-tertiary" />
                    <span className="text-[length:var(--text-base)] text-text-secondary">Slide count</span>
                  </div>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-[232px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-5 slides)</SelectItem>
                      <SelectItem value="medium">Medium (6-10 slides)</SelectItem>
                      <SelectItem value="long">Long (11-20 slides)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <Translate weight="duotone" className="size-5 shrink-0 text-text-tertiary" />
                    <span className="text-[length:var(--text-base)] text-text-secondary">Language</span>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-[232px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <ChatDots weight="duotone" className="size-5 shrink-0 text-text-tertiary" />
                    <span className="text-[length:var(--text-base)] text-text-secondary">Tone</span>
                  </div>
                  <Input
                    defaultValue="Professional"
                    className="w-[232px]"
                  />
                </div>

                {/* Target audience */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <UsersFour weight="duotone" className="size-5 shrink-0 text-text-tertiary" />
                    <span className="text-[length:var(--text-base)] text-text-secondary">Target audience</span>
                  </div>
                  <Input
                    defaultValue="Students"
                    className="w-[232px]"
                  />
                </div>

                {/* Domain */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <Globe weight="duotone" className="size-5 shrink-0 text-text-tertiary" />
                    <span className="text-[length:var(--text-base)] text-text-secondary">Domain</span>
                  </div>
                  <InputGroup className="w-[232px]">
                    <InputGroupAddon align="inline-start">
                      <InputGroupText className="text-text-tertiary">
                        https:\
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput defaultValue="google.com" />
                  </InputGroup>
                </div>
              </div>

              {/* Topic textarea */}
              <div className="flex flex-col gap-1.5">
                <Label className="pb-3 text-text-secondary">Topic</Label>
                <Textarea
                  placeholder="Visual direction presentation for upcoming rebrand initiative"
                  className="min-h-[180px] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="tertiary" size="sm">
                  Reset
                </Button>
                <Button variant="primary" size="sm">
                  Run
                </Button>
              </div>
            </div>
          </div>

          {/* ── Right: Empty state ──────────────────────────────────── */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-bg-secondary">
            {/* Stacked cards illustration */}
            <div className="relative h-[100px] w-[150px]">
              <div
                className="absolute left-1 top-0 h-[79px] w-[141px] rounded bg-bg-tertiary shadow-elevation-1"
                style={{ transform: "rotate(-2.38deg)" }}
              />
              <div className="absolute bottom-0 left-0 h-[79px] w-[141px] rounded bg-bg-primary shadow-elevation-1" />
            </div>
            <p className="max-w-[178px] text-center text-[length:var(--text-base)] text-text-tertiary">
              Run the test and you&apos;ll see the results here.
            </p>
          </div>
        </div>
      </main>
  );
}
