"use client"

import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <NavigationMenuLink asChild>
                <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground" href="#">
                  <div className="text-[length:var(--text-base)] font-medium leading-none">Introduction</div>
                  <p className="line-clamp-2 text-[length:var(--text-base)] leading-snug text-muted-foreground">Re-usable components built with Radix UI and Tailwind CSS.</p>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground" href="#">
                  <div className="text-[length:var(--text-base)] font-medium leading-none">Installation</div>
                  <p className="line-clamp-2 text-[length:var(--text-base)] leading-snug text-muted-foreground">How to install dependencies and structure your app.</p>
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-[length:var(--text-base)] font-medium transition-colors hover:bg-accent hover:text-accent-foreground" href="#">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
