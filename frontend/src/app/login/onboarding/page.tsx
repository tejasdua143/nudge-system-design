import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex w-full max-w-sm flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div
            className="size-14 rounded-[var(--radius-card)] shadow-elevation-1"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(255, 132, 47) 7%, rgba(255, 132, 47, 0) 72%), linear-gradient(90deg, rgb(234, 82, 0), rgb(234, 82, 0))",
            }}
          />
          <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
            Welcome to Presentations AI
          </h1>
          <p className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-secondary">
            Create a workspace to generate API keys and start building
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">Workspace name</Label>
            <Input type="text" placeholder="My workspace" />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-secondary">
              What best describe you?
            </Label>
            <Select defaultValue="designer">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="product-manager">Product Manager</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="primary" size="md" className="w-full" asChild>
            <Link href="/login/invite">Create workspace</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
