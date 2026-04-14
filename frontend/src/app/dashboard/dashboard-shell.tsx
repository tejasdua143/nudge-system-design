"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import {
  HouseSimple,
  Star,
  BookOpen,
  SquaresFour,
  FolderSimple,
  FolderSimpleUser,
  UsersThree,
  File,
  ShareNetwork,
  PencilRuler,
  DownloadSimple,
  Trash,
  MagnifyingGlass,
  CaretDown,
  CaretLeft,
  Question,
  Bell,
  Plus,
  UserPlus,
  Gear,
  CreditCard,
  Check,
  GearIcon,
  Users,
  UsersFour,
  UserCircle,
  Moon,
  SignOut,
  Translate,
  SketchLogo,
  MicrosoftPowerpointLogo,
  Brain,
  Sparkle,
  BookOpenText,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ActionCardsRow } from "./action-cards"
import { RECENT_DOCS } from "./data"
import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr"
import ShinyText from "@/components/ShinyText"

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const MAIN_NAV = [
  { id: "home", label: "Home", icon: HouseSimple },
  { id: "drafts", label: "Drafts", icon: File },
  { id: "starred", label: "Starred", icon: Star },
  { id: "brand-kit", label: "Brand kit", icon: BookOpen },
  { id: "templates", label: "Templates", icon: SquaresFour },
]

const PROJECTS_NAV = [
  { id: "default-project", label: "Default project", icon: FolderSimple },
  { id: "marketing-team", label: "Marketing team", icon: FolderSimpleUser },
  { id: "design-team", label: "Design team", icon: UsersThree },
]

const BOTTOM_NAV: typeof MAIN_NAV = []

const SETTINGS_MAIN_NAV = [
  { id: "general", label: "General", icon: Gear },
  { id: "members", label: "Members", icon: Users },
  { id: "group", label: "Group", icon: UsersFour },
  { id: "billing", label: "Billing", icon: CreditCard },
]

const SETTINGS_BOTTOM_NAV = [
  { id: "profile", label: "Profile", icon: UserCircle },
]

const WORKSPACES = [
  { id: "foursquare", name: "Foursquare", initial: "F", plan: "PRO" as const, color: "bg-paids-brand-500" },
  { id: "john", name: "John\u2019s workspace", initial: "J", plan: "FREE" as const, color: "bg-orange-500" },
]


/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function SideNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; weight?: "duotone" | "regular" }>
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "flex w-full items-center justify-center lg:justify-start gap-0 lg:gap-2 rounded-[var(--radius-sm)] p-2 text-[length:var(--text-base)] leading-[var(--leading-body)] transition-colors",
        active
          ? "bg-bg-elevated-hover font-semibold text-text-primary"
          : "font-normal text-text-secondary hover:bg-bg-elevated-hover"
      )}
    >
      <Icon weight="regular" className={cn("size-5 shrink-0", active ? "text-text-primary" : "")} />
      <span className={cn("hidden lg:inline truncate", active && "text-text-primary")}>{label}</span>
    </button>
  )
}

function DocumentCard({
  id,
  title,
  status,
  author,
  gradient,
}: {
  id: string
  title: string
  status: string
  author: string
  gradient: string
}) {
  return (
    <Link
      href="/new-editor"
      className="relative flex flex-col overflow-hidden rounded-[var(--radius-sm)] bg-bg-elevated shadow-elevation-2 transition-shadow hover:shadow-elevation-3"
    >
      {/* Thumbnail */}
      <div
        className={cn(
          "aspect-video w-full bg-gradient-to-br",
          gradient
        )}
      />
      {/* Info */}
      <div className="flex flex-col gap-1 px-3 pb-3 pt-2">
        <p className="truncate text-[length:var(--text-base)] font-medium leading-[var(--leading-body)] text-text-primary">
          {title}
        </p>
        <p className="text-[length:var(--text-xs)] leading-[var(--leading-snug)] text-text-secondary">
          {status} &bull; {author}
        </p>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*  Home content                                                              */
/* -------------------------------------------------------------------------- */

function HomeContent() {
  return (
    <>
      {/* ── Header section ─────────────────────────────────────── */}
      <section className="flex flex-col gap-4 lg:gap-6 border-b border-border-secondary px-4 lg:px-6 pb-4 lg:pb-6 pt-4">
        <div className="text-[length:var(--text-xl)] lg:text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-[var(--tracking-tight)]">
          <p className="text-text-primary">
            Starting something new, John?
          </p>
        </div>
        <ActionCardsRow />
      </section>

      {/* ── Recent section ──────────────────────────────────────── */}
      <section className="p-4 lg:p-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-[length:var(--text-xl)] lg:text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] text-text-primary">
            Recent
          </h2>
          <div className="grid grid-cols-1 gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {RECENT_DOCS.map((doc) => (
              <DocumentCard key={doc.id} {...doc} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Blank page placeholder                                                    */
/* -------------------------------------------------------------------------- */

function BlankPage({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <h1 className="text-[length:var(--text-2xl)] font-medium text-text-tertiary">{title}</h1>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Upgrade button with shimmer + rotating text                               */
/* -------------------------------------------------------------------------- */

const UPGRADE_ITEMS = [
  { text: "Upgrade to Pro", icon: SketchLogo },
  { text: "Export PPT", icon: MicrosoftPowerpointLogo },
  { text: "Smarter AI", icon: Brain },
  { text: "More AI credits", icon: Sparkle },
  { text: "Brand guideline", icon: BookOpenText },
]

function UpgradeButton() {
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % UPGRADE_ITEMS.length)
        setIsAnimating(false)
      }, 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const Icon = UPGRADE_ITEMS[index].icon

  return (
    <button
      className="flex h-7 w-[140px] items-center justify-center gap-1.5 rounded-full bg-bg-brand px-2.5 transition-colors hover:bg-bg-brand-hover"
    >
      <span
        className={cn(
          "flex items-center gap-1.5 transition-all duration-200",
          isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <Icon weight="duotone" className="size-4 shrink-0 text-text-primary-inverted" />
        <ShinyText
          text={UPGRADE_ITEMS[index].text}
          speed={1}
          delay={2}
          spread={100}
          direction="left"
          color="var(--text-primary-inverted)"
          shineColor="var(--text-primary)"
          className="text-[length:var(--text-base)]"
        />
      </span>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Settings: General content                                                 */
/* -------------------------------------------------------------------------- */

function GeneralSettingsContent({ workspace }: { workspace: typeof WORKSPACES[number] }) {
  return (
    <>
      <div className="mx-auto flex h-16 w-full max-w-[768px] items-center px-6">
        <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] text-text-primary">
          General
        </h1>
      </div>
      <div className="mx-auto flex w-full max-w-[768px] flex-col gap-8 p-6">
        <div className="flex w-full flex-col gap-8">
          {/* Workspace avatar section */}
          <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-gradient-to-t from-pink-400/30 to-pink-50/30 px-6 py-6">
            <div className={cn("flex size-[100px] items-center justify-center overflow-hidden rounded-full", workspace.color)}>
              <span className="text-[length:var(--text-3xl)] font-bold text-white">{workspace.initial}</span>
            </div>
            <Button variant="tertiary" size="sm" className="h-7">
              Change
            </Button>
          </div>

          {/* Workspace name field */}
          <div className="flex w-full flex-col gap-1.5">
            <Label htmlFor="workspace-name" className="text-[length:var(--text-base)] text-text-secondary">
              Workspace name
            </Label>
            <Input
              id="workspace-name"
              defaultValue={workspace.name}
              key={workspace.id}
              className="h-11 px-3 text-[length:var(--text-base)]"
            />
          </div>
        </div>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Settings: Sidebar                                                         */
/* -------------------------------------------------------------------------- */

function SettingsSidebar({
  activeSettingsPage,
  onNavigate,
  onBack,
}: {
  activeSettingsPage: string
  onNavigate: (id: string) => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Settings header */}
      <div className="flex h-14 items-center border-b border-border-secondary px-2 lg:px-4">
        <button
          onClick={onBack}
          className="flex w-full items-center justify-center lg:justify-start gap-0 lg:gap-2 rounded-md text-[length:var(--text-base)] text-text-secondary transition-colors hover:text-text-primary"
          title="Workspace settings"
        >
          <CaretLeft weight="bold" className="size-5 shrink-0" />
          <span className="hidden lg:inline truncate leading-[var(--leading-body)]">Workspace settings</span>
        </button>
      </div>

      {/* Settings main nav */}
      <nav className="flex flex-col gap-0.5 px-2">
        {SETTINGS_MAIN_NAV.map((item) => (
          <SideNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSettingsPage === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      <Separator />

      {/* Settings bottom nav */}
      <nav className="flex flex-col gap-0.5 px-2">
        {SETTINGS_BOTTOM_NAV.map((item) => (
          <SideNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSettingsPage === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Settings: Content router                                                  */
/* -------------------------------------------------------------------------- */

function SettingsContent({ activeSettingsPage, workspace }: { activeSettingsPage: string; workspace: typeof WORKSPACES[number] }) {
  const allSettingsItems = [...SETTINGS_MAIN_NAV, ...SETTINGS_BOTTOM_NAV]
  const activeItem = allSettingsItems.find((item) => item.id === activeSettingsPage)
  const activeLabel = activeItem?.label ?? "General"

  if (activeSettingsPage === "general") {
    return <GeneralSettingsContent workspace={workspace} />
  }

  return <BlankPage title={activeLabel} />
}

/* -------------------------------------------------------------------------- */
/*  Shell                                                                     */
/* -------------------------------------------------------------------------- */

export function DashboardShell() {
  const [activePage, setActivePage] = useState("home")
  const [wsMenuOpen, setWsMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [isSettingsMode, setIsSettingsMode] = useState(false)
  const [activeSettingsPage, setActiveSettingsPage] = useState("general")
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("foursquare")
  const { theme, setTheme } = useTheme()

  const activeWorkspace = WORKSPACES.find((ws) => ws.id === activeWorkspaceId)!

  const contentKey = isSettingsMode ? `settings-${activeSettingsPage}` : activePage
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    el.style.opacity = "0"
    el.style.transform = "translateY(6px)"
    const frame = requestAnimationFrame(() => {
      el.style.opacity = "1"
      el.style.transform = "translateY(0)"
    })
    return () => cancelAnimationFrame(frame)
  }, [contentKey])

  const allNavItems = [...MAIN_NAV, ...PROJECTS_NAV, ...BOTTOM_NAV]
  const activeItem = allNavItems.find((item) => item.id === activePage)
  const activeLabel = activeItem?.label ?? "Home"

  return (
    <div className="flex h-screen bg-bg-secondary">
      {/* ── Sidebar (w-260) ────────────────────────────────────────── */}
      <aside className="relative w-[52px] lg:w-[220px] shrink-0 overflow-hidden">
          {/* Settings sidebar - slides in from right */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col overflow-y-auto overflow-y-[overlay] transition-transform duration-300 ease-in-out",
              isSettingsMode ? "translate-x-0" : "translate-x-full"
            )}
          >
            <SettingsSidebar
              activeSettingsPage={activeSettingsPage}
              onNavigate={setActiveSettingsPage}
              onBack={() => setIsSettingsMode(false)}
            />
          </div>

          {/* Dashboard sidebar - slides out to left */}
          <div
            className={cn(
              "flex h-full flex-col overflow-y-auto overflow-y-[overlay] transition-transform duration-300 ease-in-out",
              isSettingsMode ? "-translate-x-full" : "translate-x-0"
            )}
          >
            <div className="flex flex-col gap-4">
              {/* Workspace switcher */}
              <div className="flex h-14 items-center border-b border-border-secondary px-2">
                <Popover open={wsMenuOpen} onOpenChange={setWsMenuOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex w-full cursor-pointer items-center justify-center lg:justify-start gap-2 rounded-[var(--radius-lg)] py-[3px] pl-1 pr-1.5 transition-colors hover:bg-bg-elevated-hover">
                      {/* Avatar */}
                      <div className={cn("flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-logo)]", activeWorkspace.color)}>
                        <span className="text-[length:var(--text-2xs)] font-bold text-white">
                          {activeWorkspace.initial}
                        </span>
                      </div>
                      {/* Text */}
                      <div className="hidden lg:flex flex-1 items-center gap-1.5 text-[length:var(--text-base)] font-medium leading-[var(--leading-body)] w-full min-w-0">
                        <span className="truncate text-text-primary text-left">{activeWorkspace.name}</span>
                        <Badge className={cn("px-1.5 py-0 text-[length:var(--text-2xs)]", activeWorkspace.plan === "FREE" ? "bg-bg-brand text-text-primary-inverted" : "")}>{activeWorkspace.plan === "FREE" ? "UPGRADE" : activeWorkspace.plan}</Badge>
                      </div>
                      {/* Dropdown caret */}
                      <div className="hidden lg:flex items-center rounded-sm bg-bg-tertiary p-0.5">
                        <CaretDown
                          weight="bold"
                          className={cn(
                            "size-3.5 text-text-secondary transition-transform duration-200",
                            wsMenuOpen && "rotate-180"
                          )}
                        />
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={4}
                    className="flex w-59 overflow-hidden px-0 py-2 flex-col gap-2 rounded-[var(--radius-md)] border-none bg-bg-elevated shadow-elevation-3"
                  >
                    {/* Inner shadow overlay */}
                    <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]" />

                    {/* Invite button */}
                    <div className="px-2 w-full">
                      <Button
                        variant={"secondary"}
                        className="w-full">Invite new member</Button>
                    </div>

                    {/* Settings items */}
                    <div className="flex px-2 gap-1 flex-col">
                      <button
                        onClick={() => {
                          setIsSettingsMode(true)
                          setActiveSettingsPage("general")
                          setWsMenuOpen(false)
                        }}
                        className="flex items-center gap-2 rounded-md p-2 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover"
                      >
                        <GearIcon weight="duotone" className="size-5 shrink-0 text-text-secondary" />
                        <span>Settings</span>
                      </button>
                      <button className="flex items-center gap-2 rounded-md p-2 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
                        <CreditCardIcon weight="duotone" className="size-5 shrink-0 text-text-secondary" />
                        <span>Billing and subscriptions</span>
                      </button>
                    </div>

                    <Separator />

                    {/* Workspace section */}
                    <div className="px-4 pt-1">
                      <p className="text-[length:var(--text-base)] text-text-tertiary">Workspace</p>
                    </div>
                    <div className="flex px-2 gap-1 flex-col">
                      {WORKSPACES.map((ws) => {
                        const isActive = ws.id === activeWorkspaceId
                        return (
                          <button
                            key={ws.id}
                            onClick={() => {
                              setActiveWorkspaceId(ws.id)
                              setWsMenuOpen(false)
                            }}
                            className={cn(
                              "flex items-center gap-2 rounded-md p-2",
                              isActive ? "bg-bg-brand-selected" : "transition-colors hover:bg-bg-elevated-hover"
                            )}
                          >
                            <div className={cn("flex size-5 shrink-0 items-center justify-center rounded text-[length:var(--text-2xs)] font-medium text-white", ws.color)}>
                              {ws.initial}
                            </div>
                            <span className="flex-1 text-left text-[length:var(--text-base)] text-text-primary">
                              {ws.name}
                            </span>
                            <Badge className={cn("px-1.5 py-0 text-[length:var(--text-2xs)]", ws.plan === "FREE" ? "bg-bg-tertiary text-text-secondary" : "")}>{ws.plan}</Badge>

                          </button>
                        )
                      })}
                      <button className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-bg-elevated-hover">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded bg-bg-tertiary">
                          <Plus weight="bold" className="size-3.5 text-text-secondary" />
                        </div>
                        <span className="text-[length:var(--text-base)] text-text-primary">
                          Create or Join workspace
                        </span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Main nav group */}
              <nav className="flex flex-col gap-0.5 px-2">
                {MAIN_NAV.map((item) => (
                  <SideNavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activePage === item.id}
                    onClick={() => setActivePage(item.id)}
                  />
                ))}
              </nav>

              <Separator />

              {/* Projects group */}
              <div className="flex flex-col gap-0.5 px-2">
                <div className="group/projects hidden lg:flex items-center justify-between px-2 pb-1">
                  <p className="text-[length:var(--text-base)] font-normal text-text-secondary">
                    Projects
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex size-6 items-center justify-center rounded-md text-text-tertiary opacity-0 transition-all hover:bg-bg-elevated-hover hover:text-text-primary group-hover/projects:opacity-100">
                        <Plus weight="bold" className="size-3.5" />
                      </button>
                    </DialogTrigger>
                    <DialogContent size="md">
                      <DialogHeader>
                        <DialogTitle>New project</DialogTitle>
                      </DialogHeader>
                      <div className="p-4">
                        <Input id="project-name" placeholder="Enter project name" autoFocus />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="tertiary">Cancel</Button>
                        </DialogClose>
                        <Button>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {PROJECTS_NAV.map((item) => (
                  <SideNavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activePage === item.id}
                    onClick={() => setActivePage(item.id)}
                  />
                ))}
              </div>

            </div>

            {/* Sticky bottom actions */}
            <div className="mt-auto flex flex-col gap-0.5 border-t border-border-secondary px-2 py-2">
              <button
                onClick={() => {
                  setIsSettingsMode(true)
                  setActiveSettingsPage("general")
                }}
                className="flex w-full items-center justify-center lg:justify-start gap-0 lg:gap-2 rounded-[var(--radius-sm)] p-2 text-[length:var(--text-base)] text-text-secondary transition-colors hover:bg-bg-elevated-hover"
              >
                <Gear weight="regular" className="size-5 shrink-0" />
                <span className="hidden lg:inline truncate">Settings</span>
              </button>
              <button
                className="flex w-full items-center justify-center lg:justify-start gap-0 lg:gap-2 rounded-[var(--radius-sm)] p-2 text-[length:var(--text-base)] text-text-secondary transition-colors hover:bg-bg-elevated-hover"
              >
                <UserPlus weight="regular" className="size-5 shrink-0" />
                <span className="hidden lg:inline truncate">Invite member</span>
              </button>
            </div>
          </div>
        </aside>

      {/* ── Right container (header + main) ─────────────────────────── */}
      <div id="right-container" className="flex min-h-0 flex-1 flex-col border-l border-border-secondary bg-bg-secondary">
        {/* ── Top Nav (h-14 / 56px) ──────────────────────────────────── */}
        <header className="flex h-14 shrink-0 items-center justify-end overflow-hidden border-b border-border-secondary">
          {/* Right: Actions */}
          <div className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3">
            {activeWorkspace.plan === "FREE" && <UpgradeButton />}
            <button className="rounded-lg p-1 text-text-primary transition-colors hover:text-text-brand">
              <MagnifyingGlass weight="regular" className="size-5" />
            </button>
            <button className="rounded-lg p-1 text-text-primary transition-colors hover:text-text-brand">
              <Bell weight="regular" className="size-5" />
            </button>
            <Popover open={accountMenuOpen} onOpenChange={setAccountMenuOpen}>
              <PopoverTrigger asChild>
                <button className="size-7 overflow-hidden rounded-full border-[1.5px] border-white bg-paids-neutral-300 transition-opacity hover:opacity-80">
                  <span className="flex size-full items-center justify-center text-[length:var(--text-2xs)] font-medium text-text-secondary">
                    JD
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={4}
                className="flex w-[240px] flex-col gap-2 overflow-hidden rounded-[var(--radius-md)] border-none bg-bg-elevated px-0 py-2 shadow-elevation-3"
              >
                {/* User info */}
                <div className="px-2">
                  <div className="flex items-start gap-2 rounded-md p-2">
                    <Gear weight="duotone" className="mt-0.5 size-5 shrink-0 text-text-secondary" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-primary">John doe</span>
                      <span className="text-[length:var(--text-xs)] leading-[var(--leading-snug)] text-text-secondary">jd@gmail.com</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Menu items */}
                <div className="flex flex-col gap-2 px-2">
                  <button className="flex items-center gap-2 rounded-md p-2 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
                    <Translate weight="duotone" className="size-5 shrink-0 text-text-secondary" />
                    <span>Language</span>
                  </button>
                  <div className="flex items-center pr-2">
                    <div className="flex flex-1 items-center gap-2 rounded-md p-2">
                      <Moon weight="duotone" className="size-5 shrink-0 text-text-secondary" />
                      <span className="text-[length:var(--text-base)] text-text-primary">Dark mode</span>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </div>
                  <button className="flex items-center gap-2 rounded-md p-2 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
                    <SignOut weight="duotone" className="size-5 shrink-0 text-text-secondary" />
                    <span>Sign out</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* ── Content Area (elevation-3, bg-primary) ─────────────────── */}
        <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overflow-y-[overlay] bg-bg-primary">
          <div
            key={contentKey}
            ref={contentRef}
            className="flex flex-1 flex-col transition-[opacity,transform] duration-200 ease-in-out"
          >
            {isSettingsMode ? (
              <SettingsContent activeSettingsPage={activeSettingsPage} workspace={activeWorkspace} />
            ) : activePage === "home" ? (
              <HomeContent />
            ) : (
              <BlankPage title={activeLabel} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
