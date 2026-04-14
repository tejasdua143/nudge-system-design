"use client"

import {
  Command, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command"
import { Calculator, Calendar, CreditCard, Settings, User } from "lucide-react"

export function CommandDemo() {
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem><Calendar /> Calendar</CommandItem>
          <CommandItem><User /> Search Users</CommandItem>
          <CommandItem><Calculator /> Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem><CreditCard /> Billing</CommandItem>
          <CommandItem><Settings /> Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
