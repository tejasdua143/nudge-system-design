"use client";

import Link from "next/link";
import { useCreateFlow } from "./create-flow-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const ROLES = [
  "Marketing",
  "Sales",
  "Design",
  "Engineering",
  "Product",
  "Finance",
  "Operations",
  "Executive",
  "Other",
];

export default function CreatePage() {
  const { data, update } = useCreateFlow();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-sm flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Tell us about yourself
          </h1>
          <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            We&rsquo;ll use this to personalize your presentation.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Name</Label>
            <Input
              type="text"
              placeholder="e.g., Priya Sharma"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Email</Label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Role</Label>
            <NativeSelect
              value={data.role}
              onChange={(e) => update({ role: e.target.value })}
              className="w-full"
            >
              <NativeSelectOption value="" disabled>
                Select your role
              </NativeSelectOption>
              {ROLES.map((role) => (
                <NativeSelectOption key={role} value={role}>
                  {role}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <Button variant="primary" size="md" className="w-full" asChild>
            <Link href="/create/input">Continue</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
