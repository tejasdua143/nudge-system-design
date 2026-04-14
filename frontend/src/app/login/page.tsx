import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogo, GithubLogo } from "@phosphor-icons/react/dist/ssr";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-sm flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Build with Presentations AI
          </h1>
          <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            Log in to your account or create a new one to get started.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <Button variant="secondary" size="md" className="w-full">
            <GoogleLogo weight="bold" />
            Continue with Google
          </Button>
          <Button variant="secondary" size="md" className="w-full">
            <GithubLogo weight="bold" />
            Continue with Github
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border-secondary" />
            <span className="text-[length:var(--text-xs)] font-semibold text-text-tertiary">OR</span>
            <div className="h-px flex-1 bg-border-secondary" />
          </div>

          <Input type="email" placeholder="Enter your email" />

          <Button variant="primary" size="md" className="w-full" asChild>
            <Link href="/login/email">Continue with email</Link>
          </Button>

          {/* Legal */}
          <p className="text-center text-[length:var(--text-xs)] leading-[var(--leading-snug)] text-text-tertiary">
            By continuing, you agree to the{" "}
            <Link href="#" className="underline hover:text-text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
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
