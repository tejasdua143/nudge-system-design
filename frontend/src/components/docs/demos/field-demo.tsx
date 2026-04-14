import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldDemo() {
  return (
    <div className="max-w-sm space-y-4">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="name@example.com" />
        <FieldDescription>We will never share your email.</FieldDescription>
      </Field>
    </div>
  )
}
