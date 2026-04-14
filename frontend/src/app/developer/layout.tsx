"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  HouseSimple,
  Shapes,
  Plugs,
  Key,
  ChartLine,
  BookOpen,
  FolderSimple,
  Trash,
  CaretDown,
  Fire,
  Gear,
  Users,
  CreditCard,
  SignOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

/* Dev entrance — plays once on layout mount (login → developer) */
const ENTRANCE = {
  offsetY: 20,          // px the page rises from (below)
  blur: 6,              // starting blur in px
  spring: {
    type: "spring" as const,
    visualDuration: 0.3,
    bounce: 0,
  },
};

/* -------------------------------------------------------------------------- */
/*  Sidebar nav data                                                          */
/* -------------------------------------------------------------------------- */

const DEV_NAV = [
  { id: "home", label: "Home", icon: HouseSimple, href: "/developer" },
  { id: "playground", label: "Playground", icon: Shapes, href: "/developer/playground" },
  { id: "integrations", label: "Integrations", icon: Plugs },
  { id: "api-keys", label: "API Keys", icon: Key, href: "/developer/api-keys" },
  { id: "usage", label: "Usage & logs", icon: ChartLine, href: "/developer/usage" },
  { id: "docs", label: "API Docs", icon: BookOpen },
];

const WORKSPACE_MENU = [
  { id: "settings", label: "Settings", icon: Gear },
  { id: "members", label: "Members", icon: Users, href: "/developer/members" },
  { id: "billing", label: "Billing and subscriptions", icon: CreditCard },
];

const PRESENTATIONS_NAV = [
  { id: "recent", label: "Recent", icon: FolderSimple },
  { id: "generated", label: "Generated From API", icon: FolderSimple },
];

/* -------------------------------------------------------------------------- */
/*  SideNavItem                                                               */
/* -------------------------------------------------------------------------- */

function SideNavItem({
  icon: Icon,
  label,
  active,
  href,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  href?: string;
}) {
  const classes = cn(
    "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[length:var(--text-base)]",
    active
      ? "bg-bg-brand-selected font-semibold text-text-primary"
      : "text-text-secondary hover:bg-bg-elevated-hover"
  );

  const content = (
    <>
      <Icon
        weight="duotone"
        className={cn("size-5 shrink-0", active && "text-text-brand")}
      />
      <span className="truncate">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {content}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout                                                                    */
/* -------------------------------------------------------------------------- */

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{
        y: ENTRANCE.offsetY,
        filter: `blur(${ENTRANCE.blur}px)`,
        opacity: 0,
      }}
      animate={{
        y: 0,
        filter: "blur(0px)",
        opacity: 1,
      }}
      transition={ENTRANCE.spring}
      className="flex h-screen bg-bg-secondary p-1 pl-0"
    >
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="relative flex w-[260px] shrink-0 flex-col">
        {/* Workspace header */}
        <div className="flex h-[63px] items-center border-b border-border-secondary px-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="group/ws flex w-full cursor-pointer items-center gap-2 rounded-xl py-[3px] pl-1 pr-1.5 transition-colors hover:bg-bg-elevated-hover data-[state=open]:bg-bg-elevated-hover">
                {/* Avatar */}
                <div className="relative size-[34px] shrink-0 overflow-hidden rounded-md bg-neutral-800">
                  {/* Hazard tape stripes */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(-45deg, #eab308 0px, #eab308 3px, transparent 3px, transparent 7px)",
                    }}
                  />
                  {/* Profile picture */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-[30px] rounded bg-bg-secondary">
                      <span className="flex size-full items-center justify-center text-[length:var(--text-base)] font-semibold text-text-primary">
                        JD
                      </span>
                    </div>
                  </div>
                </div>
                {/* Text */}
                <div className="flex flex-1 flex-col text-left text-[length:var(--text-base)] leading-[var(--leading-body)]">
                  <span className="font-normal text-text-primary">John Doe</span>
                  <span className="text-[length:var(--text-xs)] text-text-secondary">
                    Foursquare.ai
                  </span>
                </div>
                {/* Dropdown */}
                <div className="flex items-center rounded-md bg-bg-tertiary p-1">
                  <CaretDown
                    weight="bold"
                    className="size-5 text-text-secondary transition-transform duration-150 group-data-[state=open]/ws:rotate-180"
                  />
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={4}
              className="w-[244px] rounded-lg border-none p-0 py-2 shadow-elevation-3"
            >
              <div className="flex flex-col gap-2 px-2">
                {WORKSPACE_MENU.map((item) => {
                  const classes = "flex w-full items-center gap-2 rounded-lg p-2 text-[length:var(--text-base)] text-text-primary hover:bg-bg-elevated-hover";
                  const content = (
                    <>
                      <item.icon weight="regular" className="size-5 shrink-0 text-text-secondary" />
                      {item.label}
                    </>
                  );
                  return item.href ? (
                    <Link key={item.id} href={item.href} className={classes}>
                      {content}
                    </Link>
                  ) : (
                    <button key={item.id} className={classes}>
                      {content}
                    </button>
                  );
                })}
              </div>
              <div className="my-2 h-px bg-border-tertiary" />
              <div className="px-2">
                <button className="flex w-full items-center gap-2 rounded-lg p-2 text-[length:var(--text-base)] text-text-primary hover:bg-bg-elevated-hover">
                  <SignOut weight="regular" className="size-5 shrink-0 text-text-secondary" />
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Nav */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto pt-4">
          {/* Developer nav */}
          <div className="flex flex-col gap-0.5 px-2">
            {DEV_NAV.map((item) => (
              <SideNavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={
                  item.href
                    ? item.href === "/developer"
                      ? pathname === "/developer"
                      : pathname.startsWith(item.href)
                    : false
                }
              />
            ))}
          </div>

          {/* Divider */}
          <div className="mx-0 h-px bg-border-secondary" />

          {/* Presentations section */}
          <div className="flex flex-col gap-0.5 px-2">
            <span className="px-2 py-2 text-[length:var(--text-base)] text-text-secondary">
              Presentations
            </span>
            {PRESENTATIONS_NAV.map((item) => (
              <SideNavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="mx-0 h-px bg-border-secondary" />

          {/* Bottom nav */}
          <div className="flex flex-col gap-0.5 px-2">
            <SideNavItem icon={Trash} label="Recently deleted" />
          </div>
        </div>

        {/* Credits card */}
        <div className="mx-2 mb-2 flex flex-col items-center gap-3 rounded-lg bg-bg-elevated py-3 shadow-elevation-2">
          <div className="flex items-center gap-2">
            <Fire weight="fill" className="size-5 text-text-brand" />
            <p className="text-[length:var(--text-base)]">
              <span className="font-medium text-text-primary">200 </span>
              <span className="text-text-tertiary">credits left</span>
            </p>
          </div>
          <div className="h-px w-full bg-border-tertiary" />
          <span className="text-[length:var(--text-base)] font-semibold text-text-brand">
            Upgrade for more AI
          </span>
        </div>
      </aside>

      {/* ── Content Area ─────────────────────────────────────────────── */}
      {children}
    </motion.div>
  );
}
