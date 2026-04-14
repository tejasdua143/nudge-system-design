import { Mail, Search, Eye, DollarSign, AtSign } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupButton,
} from "@/components/ui/input-group"

export function InputGroupDemo() {
  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <Mail className="size-4" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Email address" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="www.example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <DollarSign className="size-4" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" type="number" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <Search className="size-4" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" variant="ghost" aria-label="Clear">
            <Eye className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <AtSign className="size-4" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="username" />
      </InputGroup>
    </div>
  )
}
