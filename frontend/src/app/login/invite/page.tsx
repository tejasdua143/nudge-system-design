import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function InvitePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-sm flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <EnvelopeSimple className="size-8 text-text-brand" weight="duotone" />
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Invite your team
          </h1>
          <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            Member can have access to API and Presentations editor.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Email</Label>
            <Textarea
              placeholder="text@gmail.com"
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="primary" size="md" className="w-full" asChild>
              <Link href="/login/claim">Continue</Link>
            </Button>
            <Button variant="secondary" size="md" className="w-full" asChild>
              <Link href="/login/claim">I'll invite my team later</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
