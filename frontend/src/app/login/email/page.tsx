"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";

export default function LoginEmailPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-sm flex-col gap-8">
        {/* Header */}
        <h1 className="text-center text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
          Enter your password
        </h1>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Email</Label>
            <Input type="email" value="johndoe@gmail.com" readOnly />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Password</Label>
            <InputGroup>
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Button variant="primary" size="md" className="w-full" asChild>
            <Link href="/login/verify">Continue</Link>
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
