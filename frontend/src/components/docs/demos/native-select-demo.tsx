import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export function NativeSelectDemo() {
  return (
    <NativeSelect defaultValue="react">
      <NativeSelectOption value="" disabled>Select a framework</NativeSelectOption>
      <NativeSelectOption value="react">React</NativeSelectOption>
      <NativeSelectOption value="vue">Vue</NativeSelectOption>
      <NativeSelectOption value="angular">Angular</NativeSelectOption>
      <NativeSelectOption value="svelte">Svelte</NativeSelectOption>
    </NativeSelect>
  )
}
