"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { GoogleLogo, GithubLogo } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const LOGO_ASCII = `
 ██████╗  █████╗ ██╗██████╗ ███████╗
 ██╔══██╗██╔══██╗██║██╔══██╗██╔════╝
 ██████╔╝███████║██║██║  ██║███████╗
 ██╔═══╝ ██╔══██║██║██║  ██║╚════██║
 ██║     ██║  ██║██║██████╔╝███████║
 ╚═╝     ╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝
`.trim();

function AsciiBackground() {
  const rows = 12;
  const cols = 6;

  const grid = useMemo(() => {
    return Array.from({ length: rows * cols }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = row % 2 === 0 ? 0 : 50;
      return { row, col, offsetX };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ opacity: 0.03 }}>
        {grid.map(({ row, col, offsetX }, i) => (
          <pre
            key={i}
            className="absolute font-[family-name:var(--font-geist-mono)] text-[6px] leading-[1.1] text-text-primary whitespace-pre"
            style={{
              top: `${(row / rows) * 100}%`,
              left: `calc(${(col / cols) * 100}% + ${offsetX}px)`,
            }}
          >
            {LOGO_ASCII}
          </pre>
        ))}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-primary">
      <AsciiBackground />
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Create your account
          </h1>
          <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            Get started with Presentations AI for free.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          {/* OAuth */}
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
            <span className="text-[length:var(--text-xs)] font-semibold text-text-tertiary">
              OR
            </span>
            <div className="h-px flex-1 bg-border-secondary" />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Full name</Label>
            <Input type="text" placeholder="Enter your full name" />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Email</Label>
            <Input type="email" placeholder="Enter your email" />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Password</Label>
            <InputGroup>
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Confirm password</Label>
            <InputGroup>
              <InputGroupInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <EyeSlash /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 py-1">
            <Checkbox id="terms" className="mt-0.5" />
            <label
              htmlFor="terms"
              className="text-[length:var(--text-xs)] leading-[var(--leading-snug)] text-text-secondary"
            >
              I agree to the{" "}
              <Link href="#" className="underline hover:text-text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-text-primary">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button variant="primary" size="md" className="w-full">
            Create account
          </Button>

          {/* Login link */}
          <p className="text-center text-[length:var(--text-xs)] leading-[var(--leading-snug)] text-text-tertiary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-text-brand hover:text-text-brand-hover"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
