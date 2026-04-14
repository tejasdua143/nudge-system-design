import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyCodePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-sm flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Check your inbox
          </h1>
          <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            Enter the code we sent to your email address.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <Input type="password" placeholder="Enter verification code" />

          <Button variant="primary" size="md" className="w-full" asChild>
            <Link href="/login/onboarding">Verify code</Link>
          </Button>

          {/* Legal */}
          <p className="text-center text-[length:var(--text-xs)] leading-[var(--leading-snug)] text-text-tertiary">
            By continuing, you agree to Presentations AI{" "}
            <Link href="#" className="underline hover:text-text-primary">
              Commercial Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-text-primary">
              Usage Policy
            </Link>
            , and acknowledge our{" "}
            <Link href="#" className="underline hover:text-text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
