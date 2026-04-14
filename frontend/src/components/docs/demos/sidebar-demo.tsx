"use client"

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Inbox, Calendar, Search, Settings } from "lucide-react"

const items = [
  { title: "Home", icon: Home },
  { title: "Inbox", icon: Inbox },
  { title: "Calendar", icon: Calendar },
  { title: "Search", icon: Search },
  { title: "Settings", icon: Settings },
]

export function SidebarDemo() {
  return (
    <SidebarProvider className="min-h-[300px] relative rounded-lg border overflow-hidden">
      <Sidebar collapsible="icon" className="absolute">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="p-4">
        <SidebarTrigger />
        <p className="mt-2 text-[length:var(--text-base)] text-muted-foreground">Click the trigger to toggle the sidebar.</p>
      </main>
    </SidebarProvider>
  )
}
