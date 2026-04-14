"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, AlertCircle } from "lucide-react"
import { ComponentPlayground } from "@/components/docs/component-playground"
import { Separator } from "@/components/ui/separator"

export function AlertDemo() {
  return (
    <div className="space-y-6">
      <ComponentPlayground
        controls={[
          {
            type: "select",
            name: "variant",
            label: "Variant",
            options: ["default", "destructive"],
          },
          { type: "text", name: "title", label: "Title", defaultValue: "Heads up!" },
          {
            type: "text",
            name: "description",
            label: "Description",
            defaultValue: "You can add components using the CLI.",
          },
        ]}
        render={(props) => (
          <Alert
            variant={props.variant as "default" | "destructive"}
            className="max-w-md"
          >
            {props.variant === "destructive" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Terminal className="h-4 w-4" />
            )}
            <AlertTitle>{(props.title as string) || "Alert"}</AlertTitle>
            <AlertDescription>
              {(props.description as string) || "Alert description."}
            </AlertDescription>
          </Alert>
        )}
      />

      <Separator />

      <div>
        <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Examples
        </p>
        <div className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the CLI.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
