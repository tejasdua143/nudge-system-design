"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  HouseSimple,
  ArrowUUpLeft,
  ArrowUUpRight,
  MagnifyingGlass,
  Question,
  Plus,
  DotsThreeVertical,
  Play,
  ListBullets,
  ArrowsInSimple,
  Palette,
  ArrowsClockwise,
  FilmStrip as FilmStripIcon,
  MicrosoftPowerpointLogo,
  SlidersHorizontal,
  ChartLineUp,
  ChatDots,
  Globe,
  UserCircle,
  Copy,
  Layout,
  Star,
  Folders,
  Trash,
  Sparkle,
  DotsSixVertical,
  ArrowsOutSimple,
  FunnelSimple,
  ChartPie,
  Table,
  CirclesThree,
  Image,
  TextT,
  Users,
  Quotes,
  MagicWand,
  CardsThree,
  X,
  ArrowLeft,
  Paperclip,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Smiley,
  Sticker,
  Flag,
  Notepad,
  EyeSlash,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Dialog, DialogPortal } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import ShinyText from "@/components/ShinyText"

/* -------------------------------------------------------------------------- */
/*  Mock user data                                                            */
/* -------------------------------------------------------------------------- */

const COLLABORATORS = [
  { id: "you", name: "Jamison Park", isYou: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { id: "walter", name: "Walter Bishop", isYou: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { id: "naomi", name: "Naomi Singh", isYou: false, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
  { id: "ricardo", name: "Ricardo Nunez", isYou: false, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
  { id: "maya", name: "Maya Chen", isYou: false, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" },
  { id: "alex", name: "Alex Thompson", isYou: false, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
]

/* -------------------------------------------------------------------------- */
/*  Canvas config                                                             */
/* -------------------------------------------------------------------------- */

const CANVAS_ACTIVE_OPACITY = 1
const CANVAS_INACTIVE_OPACITY = 0.4

/* -------------------------------------------------------------------------- */
/*  Mock slide data                                                           */
/* -------------------------------------------------------------------------- */

const SLIDES = [
  { id: 1, label: "Company Overview" },
  { id: 2, label: "Revenue" },
  { id: 3, label: "Global Reach" },
  { id: 4, label: "Quarterly Stats" },
  { id: 5, label: "Business Growth" },
]

/* -------------------------------------------------------------------------- */
/*  Top bar                                                                   */
/* -------------------------------------------------------------------------- */

function EditableTitle() {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("Monthly business review")
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    setTitle(draft)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave()
    if (e.key === "Escape") handleCancel()
  }

  if (isEditing) {
    return (
      <div className="flex items-center p-1">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="rounded px-2 py-1 text-[length:var(--text-base)] text-text-primary outline-none shadow-[var(--shadow-text-field-focused)]"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center p-1">
      <button
        onClick={() => { setDraft(title); setIsEditing(true) }}
        className="cursor-text rounded px-2 py-1 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover"
      >
        {title}
      </button>
    </div>
  )
}


/* Figma: icon buttons are size-[28px] with p-[6px], wrapped in p-[4px] containers */
function ToolbarIconButton({ children, className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "flex size-7 items-center justify-center rounded text-text-secondary transition-colors hover:bg-bg-elevated-hover hover:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function EditorTopBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-3">
      {/* Left toolbar — Figma: p-[4px] containers, size-[28px] icon inserts = 36px height */}
      <div className="flex items-center rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-2">
        <div className="flex items-center p-1">
          <Link href="/dashboard" className="flex size-7 items-center justify-center rounded text-text-secondary transition-colors hover:bg-bg-elevated-hover hover:text-text-primary">
            <HouseSimple className="size-4" />
          </Link>
        </div>
        <div className="self-stretch w-px bg-border-secondary" />
        <EditableTitle />
        <div className="self-stretch w-px bg-border-secondary" />
        <div className="flex items-center p-1">
          <ToolbarIconButton>
            <ArrowUUpLeft className="size-4" />
          </ToolbarIconButton>
        </div>
        <div className="self-stretch w-px bg-border-secondary" />
        <div className="flex items-center p-1">
          <ToolbarIconButton>
            <ArrowUUpRight className="size-4" />
          </ToolbarIconButton>
        </div>
      </div>

      {/* Right toolbar group */}
      <div className="flex items-center gap-2">
        {/* Upgrade + Export as PPT */}
        <div className="flex h-9 items-center gap-1">
          <button className="flex h-full items-center rounded-[var(--radius-md)] border border-border-brand bg-bg-elevated px-2.5 shadow-elevation-2 transition-colors hover:bg-bg-brand/5">
            <ShinyText
              text="Upgrade"
              speed={1}
              delay={2}
              spread={100}
              direction="left"
              color="var(--text-brand)"
              shineColor="var(--text-primary-inverted)"
              className="text-[length:var(--text-base)]"
            />
          </button>
          <Button variant="primary" size="sm" className="h-full gap-1.5 rounded-[var(--radius-md)] px-2.5 font-normal">
            <MicrosoftPowerpointLogo weight="regular" className="size-4" />
            Export as PPT
          </Button>
        </div>
        {/* Right actions toolbar */}
        <div className="flex items-center rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-2">
          {/* User avatars — Figma: p-[4px] container, px-[6px] py-[4px] insert, avatars 20px */}
          <div className="flex items-center p-1">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center rounded px-1.5 py-1 transition-colors hover:bg-bg-elevated-hover">
                  <AvatarGroup>
                    {COLLABORATORS.slice(0, 3).map((user) => (
                      <Avatar key={user.id} className="size-5">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-paids-neutral-200 text-[length:var(--text-3xs)]" />
                      </Avatar>
                    ))}
                    {COLLABORATORS.length > 3 && (
                      <Avatar className="size-5">
                        <AvatarFallback className="bg-paids-neutral-200 text-[length:var(--text-3xs)] text-text-primary">+{COLLABORATORS.length - 3}</AvatarFallback>
                      </Avatar>
                    )}
                  </AvatarGroup>
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" sideOffset={12} align="end" className="w-[220px] p-0">
                {/* Current user */}
                <div className="flex flex-col p-1">
                  {COLLABORATORS.filter((u) => u.isYou).map((user) => (
                    <div key={user.id}>
                      <div className="flex items-center gap-3 rounded-lg p-2">
                        <Avatar className="size-5">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-paids-neutral-200 text-[length:var(--text-3xs)]" />
                        </Avatar>
                        <span className="text-[length:var(--text-base)] text-text-primary">{user.name} (you)</span>
                      </div>
                      <div className="px-2 py-1">
                        <Button variant="tertiary" size="sm" className="h-7 w-full rounded-[var(--radius-sm)] text-[length:var(--text-xs)]">
                          Spotlight me
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-px w-full bg-border-secondary" />
                {/* Other collaborators */}
                <div className="flex flex-col p-1">
                  {COLLABORATORS.filter((u) => !u.isYou).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 rounded-[var(--radius-sm)] p-2 transition-colors hover:bg-bg-elevated-hover">
                      <Avatar className="size-5">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-paids-neutral-200 text-[length:var(--text-3xs)]" />
                      </Avatar>
                      <span className="text-[length:var(--text-base)] text-text-primary">{user.name}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="self-stretch w-px bg-border-secondary" />
          {/* Share — Figma: p-[4px] container, px-[6px] py-[4px] insert */}
          <div className="flex items-center p-1">
            <button className="flex items-center rounded px-1.5 py-1 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
              Share
            </button>
          </div>
          <div className="self-stretch w-px bg-border-secondary" />
          {/* Present — Figma: p-[4px] container, px-[8px] py-[4px] insert, gap-[8px] */}
          <div className="flex items-center p-1">
            <button className="flex items-center rounded px-2 py-1 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
              Present
            </button>
          </div>
          <div className="self-stretch w-px bg-border-secondary" />
          {/* 3-dot menu — Figma: p-[4px] container, size-[28px] p-[6px] insert */}
          <div className="flex items-center p-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ToolbarIconButton>
                  <DotsThreeVertical weight="bold" className="size-4" />
                </ToolbarIconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={12} alignOffset={-4} className="w-[232px]">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex-col items-start gap-0.5">
                    <div className="flex items-center gap-3">
                      <SlidersHorizontal weight="regular" className="size-5 shrink-0 text-text-secondary" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[length:var(--text-base)] text-text-primary">Presentation settings</span>
                        <span className="text-[length:var(--text-xs)] text-text-tertiary">Logo, animations and footer settings</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ArrowsClockwise weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Refresh Data
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ChartLineUp weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Analytics
                    <span className="ml-auto rounded-full bg-bg-brand px-1.5 py-0.5 text-[length:var(--text-xs)] text-white">Pro</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ChatDots weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Comments
                    <span className="ml-auto rounded-full bg-bg-brand px-1.5 py-0.5 text-[length:var(--text-xs)] text-white">Pro</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Globe weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Publish
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserCircle weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Meet &amp; present
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Duplicate presentation
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Layout weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Save as template
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Add to favourites
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Folders weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    Move to folder
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <Trash weight="regular" className="size-5 shrink-0" />
                    Delete presentation
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Filmstrip sidebar                                                         */
/* -------------------------------------------------------------------------- */

type FilmstripMode = "filmstrip" | "list" | "collapsed"

function ListSlideRow({
  slide,
  isActive,
  isGenerating,
  onClick,
}: {
  slide: (typeof SLIDES)[number]
  isActive: boolean
  isGenerating?: boolean
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex w-full items-center gap-2 overflow-hidden rounded text-left transition-shadow",
        isActive
          ? "shadow-[0px_0px_0px_2px_var(--border-brand-secondary),0px_1px_2px_0px_var(--shadow-drop-2),inset_0px_0px_0px_1px_var(--border-brand)]"
          : "shadow-[0px_0px_0px_1px_var(--shadow-drop-2),0px_1px_2px_0px_var(--shadow-drop-2)]"
      )}
    >
      {/* Number / drag handle cell */}
      <div
        className={cn(
          "flex shrink-0 items-center border-r border-border-secondary p-2",
          isActive ? "bg-bg-brand-inverted" : "bg-bg-tertiary"
        )}
      >
        <div className="flex size-4 items-center justify-center">
          {isGenerating ? (
            <motion.div
              className="size-3.5 rounded-full border-[1.5px] border-border-brand border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : isHovered ? (
            <DotsSixVertical className="size-4 text-text-secondary" />
          ) : (
            <span
              className={cn(
                "text-[length:var(--text-xs)] font-medium leading-[1.33]",
                isActive ? "text-text-brand" : "text-text-primary"
              )}
            >
              {slide.id}
            </span>
          )}
        </div>
      </div>
      {/* Slide name */}
      <div className="flex min-w-0 flex-1 items-center">
        {isGenerating ? (
          <ShinyText
            text="Generating..."
            speed={2}
            delay={0}
            spread={80}
            direction="left"
            color="var(--text-tertiary)"
            shineColor="var(--text-brand)"
            className="text-[length:var(--text-xs)]"
          />
        ) : (
          <span
            className={cn(
              "truncate text-[length:var(--text-xs)] leading-[1.33] text-text-primary",
              isActive ? "font-medium" : "font-normal"
            )}
          >
            {slide.label}
          </span>
        )}
      </div>
    </button>
  )
}

const FILMSTRIP_EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1] // ease-in-out-quart
const FILMSTRIP_EASE_OUT: [number, number, number, number] = [0.19, 1, 0.22, 1] // ease-out-expo
const FILMSTRIP_MORPH = { duration: 0.35, ease: FILMSTRIP_EASE_IN_OUT }
const FILMSTRIP_CONTENT = { duration: 0.15, ease: FILMSTRIP_EASE_OUT }

function Filmstrip({ activeSlide, onSlideSelect, slides, onNewSlideWithPrompt, generatingSlideId }: { activeSlide: number; onSlideSelect: (id: number) => void; slides: typeof SLIDES; onNewSlideWithPrompt: () => void; generatingSlideId: number | null }) {
  const [mode, setMode] = useState<FilmstripMode>("filmstrip")
  const collapsedRef = useRef<HTMLDivElement>(null)
  const [collapsedWidth, setCollapsedWidth] = useState(72)

  const isCollapsed = mode === "collapsed"

  // Measure collapsed content width
  useEffect(() => {
    if (isCollapsed && collapsedRef.current) {
      setCollapsedWidth(collapsedRef.current.scrollWidth)
    }
  }, [isCollapsed, activeSlide, slides.length])

  return (
    <div className="absolute left-3 top-[60px] bottom-3 flex items-center">
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? collapsedWidth : 180,
        }}
        transition={FILMSTRIP_MORPH}
        className="flex max-h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-2"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCollapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FILMSTRIP_CONTENT}
              ref={collapsedRef}
              className="flex items-center justify-center gap-1.5 px-2 py-2"
            >
              <button
                onClick={() => setMode("filmstrip")}
                className="flex items-center gap-1.5 whitespace-nowrap text-text-primary transition-colors hover:text-text-secondary"
              >
                <FilmStripIcon className="size-4 -rotate-90" />
                <span className="text-[length:var(--text-xs)] leading-none text-text-tertiary">
                  <span className="text-text-brand">{slides.findIndex((s) => s.id === activeSlide) + 1}</span>/{slides.length}
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FILMSTRIP_CONTENT}
              className="flex min-h-0 w-full flex-1 flex-col"
            >
              {/* Top controls */}
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMode("list")}
                    className={cn(
                      "flex size-5 items-center justify-center rounded transition-colors hover:bg-bg-elevated-hover",
                      mode === "list" ? "text-text-brand" : "text-muted-foreground"
                    )}
                  >
                    <ListBullets className="size-4" />
                  </button>
                  <div className="h-3 w-px bg-border-secondary" />
                  <button
                    onClick={() => setMode("filmstrip")}
                    className={cn(
                      "flex size-5 items-center justify-center rounded-sm transition-colors hover:bg-bg-elevated-hover",
                      mode === "filmstrip" ? "text-text-brand" : "text-muted-foreground"
                    )}
                  >
                    <FilmStripIcon className="size-4 -rotate-90" />
                  </button>
                </div>
                <button
                  onClick={() => setMode("collapsed")}
                  className="flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-bg-elevated-hover"
                >
                  <ArrowsInSimple className="size-4" />
                </button>
              </div>

              {/* New Slide button */}
              <div className="px-2 pb-2 pt-1.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="tertiary" size="xs" className="h-7 w-full text-[length:var(--text-xs)]">
                      New Slide
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" sideOffset={12} align="start" className="w-[200px]">
                    <DropdownMenuItem onSelect={onNewSlideWithPrompt}>
                      <MagicWand weight="regular" className="size-5 shrink-0 text-text-secondary" />
                      New slide with a prompt
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CardsThree weight="regular" className="size-5 shrink-0 text-text-secondary" />
                      New slide from template
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content area — crossfade between list/filmstrip */}
              <div className="min-h-0 flex-1 overflow-y-auto border-t border-border-secondary">
                <AnimatePresence mode="wait" initial={false}>
                  {mode === "filmstrip" && (
                    <motion.div
                      key="filmstrip-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="flex flex-col gap-3 px-3 py-3"
                    >
                      {slides.map((slide) => {
                        const isSlideGenerating = slide.id === generatingSlideId
                        return (
                          <button
                            key={slide.id}
                            onClick={() => onSlideSelect(slide.id)}
                            className={cn(
                              "relative aspect-[16/9] w-full overflow-hidden rounded transition-shadow",
                              activeSlide === slide.id
                                ? "shadow-[0px_0px_0px_2px_var(--border-brand-secondary),0px_1px_2px_0px_var(--shadow-drop-2),inset_0px_0px_0px_1px_var(--border-brand)]"
                                : "shadow-[0px_0px_0px_1px_var(--shadow-drop-2),0px_1px_2px_0px_var(--shadow-drop-2)]"
                            )}
                          >
                            <div className="flex h-full items-center justify-center bg-bg-secondary">
                              {isSlideGenerating ? (
                                <div className="h-full w-full [&_.rounded-lg]:rounded-sm">
                                  <SlideSkeletonLoading />
                                </div>
                              ) : (
                                <span className="text-[length:var(--text-3xs)] text-text-tertiary">{slide.label}</span>
                              )}
                            </div>
                            <div className="absolute left-1 top-1 flex size-5 items-center justify-center rounded bg-black/40 backdrop-blur-[2px]">
                              <span className="text-[length:var(--text-base)] font-medium leading-[1.43] text-white">{slide.id}</span>
                            </div>
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                  {mode === "list" && (
                    <motion.div
                      key="list-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="flex flex-col gap-2 p-3"
                    >
                      {slides.map((slide) => (
                        <ListSlideRow
                          key={slide.id}
                          slide={slide}
                          isActive={activeSlide === slide.id}
                          isGenerating={slide.id === generatingSlideId}
                          onClick={() => onSlideSelect(slide.id)}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Object selector modal                                                     */
/* -------------------------------------------------------------------------- */

type ObjectCategory = "text" | "list" | "diagram" | "chart" | "table" | "concept" | "media" | "people" | "quote"

const OBJECT_CATEGORIES: { id: ObjectCategory; label: string; icon: React.ElementType }[] = [
  { id: "text", label: "Text", icon: TextT },
  { id: "list", label: "List", icon: ListBullets },
  { id: "diagram", label: "Diagram", icon: FunnelSimple },
  { id: "chart", label: "Chart", icon: ChartPie },
  { id: "table", label: "Table", icon: Table },
  { id: "concept", label: "Concept", icon: CirclesThree },
  { id: "media", label: "Media", icon: Image },
  { id: "people", label: "People", icon: Users },
  { id: "quote", label: "Quote", icon: Quotes },
]

/* Thumbnail wireframe components matching Figma design patterns */
function BulletsThumbnail() {
  return (
    <div className="flex flex-col gap-[10px] px-5 py-[15px]">
      {[76, 60, 84, 52].map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="size-[5px] shrink-0 rounded-full bg-text-tertiary" />
          <div className="h-[5px] rounded bg-text-tertiary" style={{ width: w }} />
        </div>
      ))}
    </div>
  )
}

function VerticalThumbnail() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      {[76, 76, 76].map((_, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <div className="h-[5px] w-[76px] rounded-[18px] bg-text-tertiary" />
          <div className="h-[5px] w-[84px] rounded-[24px] bg-text-tertiary opacity-40" />
        </div>
      ))}
    </div>
  )
}

function HorizontalThumbnail({ selected }: { selected?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1.5 p-4">
      {[1, 2, 3, 4].map((_, i) => (
        <div key={i} className="flex flex-1 flex-col gap-0.5">
          <div className={cn("h-[5px] rounded-[18px]", selected ? "bg-text-brand" : "bg-text-tertiary")} />
          <div className="h-[5px] rounded-[24px] bg-text-tertiary opacity-40" />
          <div className="h-[5px] w-[15px] rounded-[24px] bg-text-tertiary opacity-40" />
          <div className="h-[5px] rounded-[24px] bg-text-tertiary opacity-40" />
        </div>
      ))}
    </div>
  )
}

function GridThumbnail() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-[19px] gap-y-[10px] p-4">
      {[1, 2, 3, 4].map((_, i) => (
        <div key={i} className="flex w-[46px] flex-col gap-0.5">
          <div className="h-[5px] rounded-[18px] bg-text-tertiary" />
          <div className="h-[5px] rounded-[24px] bg-text-tertiary opacity-40" />
          <div className="h-[5px] w-[31px] rounded-[24px] bg-text-tertiary opacity-40" />
        </div>
      ))}
    </div>
  )
}

function NumberOnTopThumbnail() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-[19px] gap-y-2 p-4">
      {["1", "2", "3", "4"].map((n, i) => (
        <div key={i} className="flex w-[46px] flex-col gap-[3px]">
          <span className="font-mono text-[length:var(--text-3xs)] font-medium text-text-secondary">{n}</span>
          <div className="h-[5px] rounded bg-text-tertiary" />
          <div className="h-[5px] w-[38px] rounded bg-text-tertiary opacity-30" />
        </div>
      ))}
    </div>
  )
}

function NumberHorizontalThumbnail() {
  return (
    <div className="flex items-center justify-center gap-2 p-4">
      {["01", "02", "03", "04"].map((n, i) => (
        <div key={i} className="flex flex-1 flex-col gap-[3px]">
          <span className="font-mono text-[length:var(--text-3xs)] font-medium text-text-secondary">{n}</span>
          <div className="h-[5px] rounded bg-text-tertiary" />
          <div className="h-[5px] w-[17px] rounded bg-text-tertiary opacity-30" />
        </div>
      ))}
    </div>
  )
}

function NumberOnTopShortThumbnail() {
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-4">
      {["01", "02", "03"].map((n, i) => (
        <div key={i} className="flex w-[87px] flex-col gap-0.5">
          <span className="font-mono text-[length:var(--text-3xs)] font-medium text-text-secondary">{n}</span>
          <div className="h-[5px] rounded bg-text-tertiary" />
        </div>
      ))}
    </div>
  )
}

function NumberOnLeftThumbnail() {
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-4">
      {["1", "2", "3", "4"].map((n, i) => (
        <div key={i} className="flex w-[87px] items-baseline gap-1">
          <span className="font-mono text-[length:var(--text-3xs)] font-medium text-text-secondary">{n}</span>
          <div className="h-[5px] flex-1 rounded bg-text-tertiary" />
        </div>
      ))}
    </div>
  )
}

const OBJECT_VARIANTS: Record<ObjectCategory, { sections: { title: string; items: { label: string; thumbnail: React.ReactNode; selected?: boolean }[] }[] }> = {
  list: {
    sections: [
      {
        title: "Unordered list",
        items: [
          { label: "Bullets", thumbnail: <BulletsThumbnail /> },
          { label: "Vertical", thumbnail: <VerticalThumbnail /> },
          { label: "Horizontal", thumbnail: <HorizontalThumbnail selected />, selected: true },
          { label: "Grid", thumbnail: <GridThumbnail /> },
        ],
      },
      {
        title: "Ordered list",
        items: [
          { label: "Number on top", thumbnail: <NumberOnTopThumbnail /> },
          { label: "Horizontal", thumbnail: <NumberHorizontalThumbnail /> },
          { label: "Horizontal", thumbnail: <NumberHorizontalThumbnail /> },
          { label: "Number on top - short", thumbnail: <NumberOnTopShortThumbnail /> },
          { label: "Number on left", thumbnail: <NumberOnLeftThumbnail /> },
        ],
      },
    ],
  },
  text: { sections: [{ title: "Text layouts", items: [{ label: "Heading", thumbnail: <BulletsThumbnail /> }, { label: "Body", thumbnail: <VerticalThumbnail /> }] }] },
  diagram: { sections: [{ title: "Diagram layouts", items: [{ label: "Flow", thumbnail: <HorizontalThumbnail /> }, { label: "Tree", thumbnail: <GridThumbnail /> }] }] },
  chart: { sections: [{ title: "Chart types", items: [{ label: "Bar", thumbnail: <VerticalThumbnail /> }, { label: "Pie", thumbnail: <GridThumbnail /> }] }] },
  table: { sections: [{ title: "Table layouts", items: [{ label: "Standard", thumbnail: <GridThumbnail /> }, { label: "Compact", thumbnail: <BulletsThumbnail /> }] }] },
  concept: { sections: [{ title: "Concept layouts", items: [{ label: "Venn", thumbnail: <GridThumbnail /> }, { label: "Mind map", thumbnail: <HorizontalThumbnail /> }] }] },
  media: { sections: [{ title: "Media layouts", items: [{ label: "Full", thumbnail: <VerticalThumbnail /> }, { label: "Grid", thumbnail: <GridThumbnail /> }] }] },
  people: { sections: [{ title: "People layouts", items: [{ label: "Cards", thumbnail: <HorizontalThumbnail /> }, { label: "List", thumbnail: <BulletsThumbnail /> }] }] },
  quote: { sections: [{ title: "Quote layouts", items: [{ label: "Centered", thumbnail: <VerticalThumbnail /> }, { label: "Side", thumbnail: <HorizontalThumbnail /> }] }] },
}

function ObjectSelectorModal({
  open,
  onOpenChange,
  initialCategory = "list",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCategory?: ObjectCategory
}) {
  const [activeCategory, setActiveCategory] = useState<ObjectCategory>(initialCategory)
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"selector" | "describe">("selector")
  const [selectedThumbnail, setSelectedThumbnail] = useState<React.ReactNode>(null)
  const [description, setDescription] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const describeRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      setActiveCategory(initialCategory)
      setSearch("")
      setView("selector")
      setSelectedThumbnail(null)
      setDescription("")
      hasTransitioned.current = false
      directionRef.current = 0
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [open, initialCategory])

  useEffect(() => {
    if (view === "describe") {
      setTimeout(() => describeRef.current?.focus(), 100)
    }
  }, [view])

  const MORPH_DURATION = 0.35
  const CONTENT_DURATION = 0.15
  const SLIDE_DISTANCE = 25
  const easeOut = [0.19, 1, 0.22, 1] as const // ease-out-expo
  const easeInOut = [0.77, 0, 0.175, 1] as const

  // 1 = forward (push), -1 = back (pop), 0 = initial open (no slide)
  const directionRef = useRef<1 | -1 | 0>(0)
  const hasTransitioned = useRef(false)

  const handleVariantSelect = (thumbnail: React.ReactNode) => {
    hasTransitioned.current = true
    directionRef.current = 1
    setSelectedThumbnail(thumbnail)
    setDescription("")
    setView("describe")
  }

  const handleBack = () => {
    directionRef.current = -1
    setView("selector")
  }

  const variants = OBJECT_VARIANTS[activeCategory]

  const selectorWidth = 780
  const selectorHeight = 476 // 36px header + 4px gap + 432px content + 4px padding
  const describeWidth = 600
  const describeHeight = 280

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)} />
        <div className="fixed inset-x-0 bottom-[52px] z-50 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: view === "selector" ? selectorWidth : describeWidth,
              height: view === "selector" ? selectorHeight : describeHeight,
            }}
            transition={{
              opacity: { duration: CONTENT_DURATION, ease: easeOut },
              y: { duration: CONTENT_DURATION, ease: easeOut },
              scale: { duration: CONTENT_DURATION, ease: easeOut },
              width: { duration: hasTransitioned.current ? MORPH_DURATION : 0, ease: easeInOut },
              height: { duration: hasTransitioned.current ? MORPH_DURATION : 0, ease: easeInOut },
            }}
            className="flex flex-col gap-1 rounded-lg bg-bg-secondary p-1 shadow-elevation-3"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" initial={false}>
              {view === "selector" ? (
                <motion.div
                  key="selector"
                  initial={directionRef.current === 0 ? { opacity: 0 } : { opacity: 0, x: -SLIDE_DISTANCE }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -SLIDE_DISTANCE }}
                  transition={{ duration: CONTENT_DURATION, ease: easeOut }}
                  className="flex flex-1 flex-col gap-1"
                >
                  {/* Search bar */}
                  <div className="flex items-center gap-2 px-3 pr-2.5">
                    <MagnifyingGlass weight="regular" className="size-5 shrink-0 text-text-secondary" />
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search object"
                      className="flex-1 bg-transparent py-2 text-[length:var(--text-base)] text-text-primary outline-none placeholder:text-text-tertiary"
                    />
                    <button
                      onClick={() => onOpenChange(false)}
                      className="flex size-4 items-center justify-center text-text-tertiary transition-colors hover:text-text-primary"
                    >
                      <X weight="regular" className="size-4" />
                    </button>
                  </div>

                  {/* Main content */}
                  <div className="flex flex-1 overflow-hidden rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-2">
                    {/* Left sidebar */}
                    <div className="flex w-[160px] shrink-0 flex-col gap-2 overflow-y-auto p-2">
                      {OBJECT_CATEGORIES.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                              "flex items-center gap-2 rounded px-2 py-1.5 text-[length:var(--text-base)] transition-colors",
                              activeCategory === cat.id
                                ? "bg-bg-elevated-hover text-text-primary"
                                : "text-text-primary hover:bg-bg-elevated-hover"
                            )}
                          >
                            <Icon weight="regular" className="size-4 shrink-0 text-text-secondary" />
                            {cat.label}
                          </button>
                        )
                      })}
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-border-secondary" />

                    {/* Right content */}
                    <div className="flex-1 overflow-y-auto p-1">
                      <div className="flex flex-col gap-2 px-1">
                        {variants.sections.map((section) => (
                          <div key={section.title} className="flex flex-col">
                            <div className="px-2 pb-2 pt-3">
                              <span className="text-[length:var(--text-xs)] font-medium text-text-tertiary">{section.title}</span>
                            </div>
                            <div className="flex flex-wrap gap-3 px-2">
                              {section.items.map((item) => (
                                <button
                                  key={item.label}
                                  onClick={() => handleVariantSelect(item.thumbnail)}
                                  className="flex w-[131px] flex-col items-center gap-2"
                                >
                                  <div
                                    className={cn(
                                      "h-[80px] w-full overflow-hidden rounded-[var(--radius-md)] bg-bg-secondary",
                                      item.selected
                                        ? "shadow-[0px_0px_0px_0.75px_var(--border-brand),0px_0px_0px_2px_var(--border-brand-secondary)]"
                                        : "shadow-elevation-2 hover:shadow-[0px_0px_0px_0.75px_var(--border-brand),0px_0px_0px_2px_var(--border-brand-secondary)]"
                                    )}
                                  >
                                    {item.thumbnail}
                                  </div>
                                  <span className="text-[length:var(--text-xs)] text-text-secondary">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="describe"
                  initial={{ opacity: 0, x: SLIDE_DISTANCE }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: SLIDE_DISTANCE }}
                  transition={{ duration: CONTENT_DURATION, ease: easeOut }}
                  className="flex flex-1 flex-col gap-1"
                >
                  {/* Header — back arrow + title + close */}
                  <div className="flex h-9 items-center justify-between px-3 pr-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBack}
                        className="flex size-4 items-center justify-center text-text-secondary transition-colors hover:text-text-primary"
                      >
                        <ArrowLeft weight="regular" className="size-4" />
                      </button>
                      <span className="text-[length:var(--text-base)] font-medium text-text-primary">Describe object content</span>
                    </div>
                    <button
                      onClick={() => onOpenChange(false)}
                      className="flex size-4 items-center justify-center text-text-tertiary transition-colors hover:text-text-primary"
                    >
                      <X weight="regular" className="size-4" />
                    </button>
                  </div>

                  {/* Content area */}
                  <div className="relative flex flex-1 flex-col gap-4 overflow-hidden rounded-[var(--radius-md)] bg-bg-elevated p-3 shadow-elevation-2">
                    {/* Selected variant thumbnail */}
                    <div className="h-[80px] w-[131px] shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-bg-secondary shadow-elevation-2">
                      {selectedThumbnail}
                    </div>

                    {/* Description textarea */}
                    <textarea
                      ref={describeRef}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the purpose of the object, or paste a content"
                      className="min-h-[40px] flex-1 resize-none bg-transparent text-[length:var(--text-base)] text-text-primary outline-none placeholder:text-text-tertiary"
                    />

                    {/* Footer buttons */}
                    <div className="flex items-center justify-between">
                      <Button variant="tertiary" size="xs">
                        <Paperclip weight="regular" className="size-4" />
                        Attach
                      </Button>
                      <Button
                        variant="primary"
                        size="xs"
                        disabled={!description.trim()}
                        onClick={() => onOpenChange(false)}
                      >
                        Insert object
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </DialogPortal>
    </Dialog>
  )
}

/* -------------------------------------------------------------------------- */
/*  Insert with prompt modal                                                  */
/* -------------------------------------------------------------------------- */

const PROMPT_SUGGESTIONS = [
  {
    label: "Concise summary of alignment benefit and business outcomes",
    prompt: "Create a slide that presents a concise executive summary of how cross-functional alignment drives measurable business outcomes. Include key metrics such as revenue growth, reduced time-to-market, and improved customer satisfaction scores. Highlight the correlation between team alignment initiatives and quarterly performance improvements across departments.",
  },
  {
    label: "Compare alignment vs siloed operations with metrics",
    prompt: "Design a comparison slide that contrasts aligned organizations versus siloed operations using real-world performance metrics. Show side-by-side data on communication efficiency, project delivery timelines, resource utilization rates, and employee engagement scores. Include a visual chart showing the performance gap between the two operational models over a twelve-month period.",
  },
  {
    label: "Top 5 actions to close the alignment gap (prioritized)",
    prompt: "Build a prioritized action plan slide listing the top five strategic initiatives to close the organizational alignment gap. For each action item, include the expected impact level, estimated implementation timeline, required resources, and key stakeholders responsible. Order them by potential business impact from highest to lowest with clear success criteria for each initiative.",
  },
]

function InsertPromptModal({ open, onOpenChange, onInsertSlide, title = "Insert new slide with a prompt" }: { open: boolean; onOpenChange: (v: boolean) => void; onInsertSlide: () => void; title?: string }) {
  const [prompt, setPrompt] = useState("")

  if (!open) return null

  return (
    <div className="absolute inset-x-0 bottom-[52px] z-50 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.19, 1, 0.22, 1] }}
        className="flex w-[580px] flex-col gap-1 rounded-[var(--radius-md)] bg-bg-secondary p-1 shadow-elevation-3"
      >
        {/* Title bar */}
        <div className="flex h-9 items-center justify-between pl-3 pr-2.5">
          <span className="text-[length:var(--text-base)] font-medium text-text-primary">
            {title}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="flex size-4 items-center justify-center rounded text-text-tertiary transition-colors hover:text-text-primary"
          >
            <X weight="bold" className="size-3" />
          </button>
        </div>

        {/* Content container */}
        <div className="relative flex min-h-[200px] max-h-[600px] flex-col overflow-visible rounded-[var(--radius-sm)] bg-bg-elevated px-3 pb-[52px] pt-3 shadow-elevation-2">
          {/* Text input */}
          <textarea
            ref={(el) => {
              if (el) {
                el.style.height = "auto"
                el.style.height = `${el.scrollHeight}px`
              }
            }}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              const el = e.target
              el.style.height = "auto"
              el.style.height = `${el.scrollHeight}px`
            }}
            placeholder="Describe the purpose of the slide, or paste a content"
            className="w-full resize-none bg-transparent text-[length:var(--text-base)] leading-[var(--leading-body)] text-text-primary outline-none placeholder:text-text-tertiary"
            rows={1}
          />

          {/* Prompt suggestions — overflow beyond container */}
          <div className="-mx-3 -mb-3 mt-4 flex gap-2 overflow-x-auto px-3 py-3" style={{ scrollbarWidth: "none" }}>
            {PROMPT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => setPrompt(suggestion.prompt)}
                className="shrink-0 rounded-[var(--radius-sm)] bg-bg-elevated px-3 py-2 text-left text-[length:var(--text-base)] text-text-primary shadow-elevation-2 transition-colors hover:bg-bg-elevated-hover"
                style={{ width: 256 }}
              >
                {suggestion.label}
              </button>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
            <Button variant="tertiary" size="sm" className="h-7 gap-1 rounded-[var(--radius-sm)] px-2.5">
              <Paperclip weight="regular" className="size-4" />
              Attach
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="h-7 rounded-[var(--radius-sm)] px-2.5"
              disabled={!prompt.trim()}
              style={{ opacity: prompt.trim() ? 1 : 0.4 }}
              onClick={() => {
                onOpenChange(false)
                onInsertSlide()
              }}
            >
              Insert slide
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Generating slides overlay                                                 */
/* -------------------------------------------------------------------------- */

const SKELETON_LAYOUTS: React.ReactNode[] = [
  // Layout 1: Title + 4x2 grid + right text lines
  <div key="l1" className="relative h-full w-full p-[4%]">
    <div className="mb-[3%] h-[9%] w-[23%] rounded-lg bg-bg-tertiary" />
    <div className="flex gap-[1.5%]">
      <div className="flex flex-1 flex-col gap-[1.5%]">
        <div className="flex gap-[1.5%]">
          {[0,1,2,3].map(i => <div key={i} className="flex-1 rounded-lg bg-bg-tertiary" style={{ aspectRatio: "1" }} />)}
        </div>
        <div className="flex gap-[1.5%]">
          {[0,1,2,3].map(i => <div key={i} className="flex-1 rounded-lg bg-bg-tertiary" style={{ aspectRatio: "1" }} />)}
        </div>
      </div>
      <div className="flex w-[18%] flex-col gap-[6%] pt-[6%]">
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-[65%] rounded-lg bg-bg-tertiary" />
        <div className="mt-[12%] h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-[65%] rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-[65%] rounded-lg bg-bg-tertiary" />
      </div>
    </div>
  </div>,
  // Layout 2: Title + 2 columns of text
  <div key="l2" className="relative h-full w-full p-[4%]">
    <div className="mb-[2%] h-[9%] w-[40%] rounded-lg bg-bg-tertiary" />
    <div className="mb-[2%] h-3 w-[30%] rounded-lg bg-bg-tertiary" />
    <div className="flex gap-[4%] pt-[3%]">
      <div className="flex flex-1 flex-col gap-[8px]">
        {[100,100,70,100,100,80,100,60].map((w,i) => <div key={i} className="h-3 rounded-lg bg-bg-tertiary" style={{ width: `${w}%` }} />)}
      </div>
      <div className="flex flex-1 flex-col gap-[8px]">
        {[100,80,100,100,70,100,100,90].map((w,i) => <div key={i} className="h-3 rounded-lg bg-bg-tertiary" style={{ width: `${w}%` }} />)}
      </div>
    </div>
  </div>,
  // Layout 3: Big hero image + bottom text
  <div key="l3" className="relative flex h-full w-full flex-col p-[4%]">
    <div className="flex-1 rounded-lg bg-bg-tertiary" />
    <div className="mt-[3%] flex gap-[4%]">
      <div className="flex flex-1 flex-col gap-[8px]">
        <div className="h-3 w-[80%] rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-[60%] rounded-lg bg-bg-tertiary" />
      </div>
      <div className="flex flex-1 flex-col gap-[8px]">
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-[70%] rounded-lg bg-bg-tertiary" />
        <div className="h-3 w-full rounded-lg bg-bg-tertiary" />
      </div>
    </div>
  </div>,
  // Layout 4: Left text + right large image
  <div key="l4" className="relative flex h-full w-full gap-[3%] p-[4%]">
    <div className="flex w-[35%] flex-col gap-[8px] pt-[4%]">
      <div className="mb-[4%] h-[9%] w-[70%] rounded-lg bg-bg-tertiary" />
      {[100,100,70,100,80,100,100,65,100,100].map((w,i) => <div key={i} className="h-3 rounded-lg bg-bg-tertiary" style={{ width: `${w}%` }} />)}
    </div>
    <div className="flex-1 rounded-lg bg-bg-tertiary" />
  </div>,
]

function SlideSkeletonLoading() {
  const [layoutIndex, setLayoutIndex] = useState(() => Math.floor(Math.random() * SKELETON_LAYOUTS.length))

  useEffect(() => {
    const timer = setInterval(() => {
      setLayoutIndex((prev) => {
        let next = prev
        while (next === prev) next = Math.floor(Math.random() * SKELETON_LAYOUTS.length)
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-full w-full">
      {/* Shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <motion.div
          className="absolute inset-y-0"
          style={{
            width: 160,
            background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
          }}
          animate={{ left: ["-20%", "120%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* Skeleton layout with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={layoutIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          {SKELETON_LAYOUTS[layoutIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Theme panel                                                               */
/* -------------------------------------------------------------------------- */

const THEMES = [
  { id: "graphite", name: "Graphite", desc: "Premium, modern, sophisticated, high-contrast", bg: "bg-neutral-900" },
  { id: "canvas", name: "Canvas", desc: "Premium, warmth, sophisticated, editorial, luxury", bg: "bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100" },
  { id: "pastel", name: "Pastel", desc: "Soft, friendly, approachable, educational", bg: "bg-gradient-to-br from-amber-50 via-white to-emerald-50" },
  { id: "midnight", name: "Midnight", desc: "Bold, dramatic, sleek, professional", bg: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800" },
]

type ColorPalette = { id: string; name: string; colors: string[] }

const COLOR_PALETTES_WORKSPACE: ColorPalette[] = [
  { id: "maritime", name: "Maritime", colors: ["#032c75", "#004bc3", "#fec200"] },
  { id: "cronotone", name: "Cronotone", colors: ["#463abd", "#f13e68", "#ff8900", "#00879e"] },
  { id: "corel", name: "Corel", colors: ["#6248ff", "#c756ff", "#ff6978", "#ffc551", "#279cff"] },
]

const COLOR_PALETTES_ALL: ColorPalette[] = [
  { id: "spectrum", name: "Spectrum", colors: ["#0031ea", "#005df1", "#00b4eb", "#00e3e3"] },
  { id: "tide", name: "Tide", colors: ["#032c75", "#004bc3", "#fec200"] },
  { id: "ember", name: "Ember", colors: ["#dc2626", "#f97316", "#facc15", "#fef08a"] },
  { id: "forest", name: "Forest", colors: ["#064e3b", "#059669", "#34d399", "#a7f3d0"] },
  { id: "sunset", name: "Sunset", colors: ["#7c2d12", "#ea580c", "#fb923c", "#fdba74", "#fef3c7"] },
  { id: "arctic", name: "Arctic", colors: ["#1e3a5f", "#3b82f6", "#93c5fd", "#dbeafe"] },
  { id: "bloom", name: "Bloom", colors: ["#831843", "#db2777", "#f472b6", "#fbcfe8"] },
  { id: "slate", name: "Slate", colors: ["#1e293b", "#475569", "#94a3b8", "#e2e8f0"] },
  { id: "aurora", name: "Aurora", colors: ["#312e81", "#6366f1", "#a78bfa", "#22d3ee", "#34d399"] },
  { id: "terra", name: "Terra", colors: ["#78350f", "#b45309", "#d97706", "#92400e"] },
]

function ColorPaletteCard({ palette, isCurrent, isSelected, onSelect }: { palette: ColorPalette; isCurrent?: boolean; isSelected?: boolean; onSelect: () => void }) {
  return (
    <div
      role="button"
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-[var(--radius-sm)] bg-white p-3",
        isSelected
          ? "shadow-[0px_0px_0px_0.75px_var(--border-brand),0px_0px_0px_2px_var(--border-brand-secondary),0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          : "shadow-elevation-1"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--text-base)] text-text-primary">{palette.name}</span>
          {isCurrent && (
            <span className="flex items-center gap-1 rounded-full bg-bg-brand px-1.5 py-0.5 pr-2">
              <CheckCircle weight="fill" className="size-[13px] text-white" />
              <span className="text-[length:var(--text-xs)] text-white">Current</span>
            </span>
          )}
        </div>
        <DotsThreeVertical weight="bold" className="size-4 text-text-tertiary" />
      </div>
      <div className="flex rounded" style={{ height: 40, borderRadius: 4, overflow: "hidden" }}>
        {palette.colors.map((color, i) => (
          <div key={i} style={{ backgroundColor: color, flexGrow: 1, flexShrink: 0, flexBasis: 0, height: "100%" }} />
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Remix panel                                                               */
/* -------------------------------------------------------------------------- */

const REMIX_VARIATIONS = [
  { id: "current", label: "Current", isCurrent: true },
  { id: "variation-1", label: "Variation 1", isCurrent: false },
  { id: "variation-2", label: "Variation 2", isCurrent: false },
  { id: "variation-3", label: "Variation 3", isCurrent: false },
]

function RemixPanel({ open, onClose, onExitComplete }: { open: boolean; onClose: () => void; onExitComplete?: () => void }) {
  const [selectedVariation, setSelectedVariation] = useState("current")

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="absolute right-3 top-3 bottom-3 z-40 flex w-[320px] flex-col overflow-hidden rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-secondary p-3">
            <span className="text-[length:var(--text-base)] font-medium text-text-primary">Remix</span>
            <button onClick={onClose} className="flex size-4 items-center justify-center text-text-tertiary transition-colors hover:text-text-primary">
              <X weight="bold" className="size-3" />
            </button>
          </div>

          {/* Variations */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
            {REMIX_VARIATIONS.map((variation) => {
              const isSelected = selectedVariation === variation.id
              return (
                <div
                  key={variation.id}
                  role="button"
                  onClick={() => setSelectedVariation(variation.id)}
                  className={cn(
                    "relative flex h-[172px] flex-col overflow-hidden rounded-[var(--radius-sm)] bg-white transition-shadow",
                    isSelected
                      ? "shadow-[0px_0px_0px_0.75px_var(--border-brand),0px_0px_0px_2px_var(--border-brand-secondary),0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                      : "shadow-elevation-1 hover:shadow-elevation-2"
                  )}
                >
                  {/* Slide preview placeholder */}
                  <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-paids-neutral-50 to-paids-neutral-100">
                    <span className="text-[length:var(--text-xs)] text-text-tertiary">{variation.label}</span>
                  </div>

                  {/* Current badge */}
                  {variation.isCurrent && (
                    <div className="absolute left-2 top-2">
                      <div className="flex items-center gap-1 rounded-full bg-bg-brand px-1.5 py-0.5 pr-2">
                        <CheckCircle weight="fill" className="size-[13px] text-white" />
                        <span className="text-[length:var(--text-xs)] text-white">Current</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type ThemeTab = "design" | "color" | "font"

function ThemePanel({ open, onClose, onExitComplete }: { open: boolean; onClose: () => void; onExitComplete?: () => void }) {
  const [activeTab, setActiveTab] = useState<ThemeTab>("design")
  const [selectedTheme, setSelectedTheme] = useState("graphite")
  const [selectedColor, setSelectedColor] = useState("maritime")

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="absolute right-3 top-3 bottom-3 z-40 flex w-[320px] flex-col overflow-hidden rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3">
            <span className="text-[length:var(--text-base)] font-medium text-text-primary">Theme</span>
            <button onClick={onClose} className="flex size-4 items-center justify-center text-text-tertiary transition-colors hover:text-text-primary">
              <X weight="bold" className="size-3" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-t border-border-secondary">
            {(["design", "color", "font"] as ThemeTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-center text-[length:var(--text-base)] capitalize transition-colors",
                  activeTab === tab
                    ? "border-b-2 border-border-brand pb-2.5 font-medium text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
            {activeTab === "design" &&
              THEMES.map((theme) => {
                const isCurrent = selectedTheme === theme.id
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={cn(
                      "relative h-[172px] w-full overflow-hidden rounded-[var(--radius-sm)]",
                      isCurrent
                        ? "shadow-[0px_0px_0px_0.75px_var(--border-brand),0px_0px_0px_2px_var(--border-brand-secondary),0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                        : "shadow-elevation-1 hover:shadow-elevation-2"
                    )}
                  >
                    <div className={cn("flex h-full w-full flex-col items-start justify-end p-4 text-left", theme.bg)}>
                      <span className={cn(
                        "text-[length:var(--text-2xl)] font-semibold",
                        theme.id === "graphite" || theme.id === "midnight" ? "text-white" : "text-text-primary"
                      )}>
                        {theme.name}
                      </span>
                      <span className={cn(
                        "text-left text-[length:var(--text-xs)]",
                        theme.id === "graphite" || theme.id === "midnight" ? "text-white/60" : "text-text-tertiary"
                      )}>
                        {theme.desc}
                      </span>
                    </div>
                    {isCurrent && (
                      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-bg-brand px-1.5 py-0.5 pr-2">
                        <CheckCircle weight="fill" className="size-[13px] text-white" />
                        <span className="text-[length:var(--text-xs)] text-white">Current</span>
                      </div>
                    )}
                  </button>
                )
              })}
            {activeTab === "color" && (
              <>
                {/* Workspace section */}
                <div className="self-start px-3 py-2">
                  <span className="text-[length:var(--text-xs)] font-medium text-text-tertiary">Workspace</span>
                </div>
                {COLOR_PALETTES_WORKSPACE.map((p) => (
                  <ColorPaletteCard
                    key={p.id}
                    palette={p}
                    isCurrent={selectedColor === p.id}
                    isSelected={selectedColor === p.id}
                    onSelect={() => setSelectedColor(p.id)}
                  />
                ))}

                {/* All section */}
                <div className="self-start px-3 py-2">
                  <span className="text-[length:var(--text-xs)] font-medium text-text-tertiary">All</span>
                </div>
                {COLOR_PALETTES_ALL.map((p) => (
                  <ColorPaletteCard
                    key={p.id}
                    palette={p}
                    isCurrent={selectedColor === p.id}
                    isSelected={selectedColor === p.id}
                    onSelect={() => setSelectedColor(p.id)}
                  />
                ))}
              </>
            )}
            {activeTab === "font" && (
              <div className="flex flex-1 items-center justify-center text-[length:var(--text-base)] text-text-tertiary">
                Font options coming soon
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------- */
/*  Bottom bar                                                                */
/* -------------------------------------------------------------------------- */

function BottomBar({ onObjectSelect, onInsertWithPrompt, onThemeToggle, onRemixToggle }: { onObjectSelect: (category: ObjectCategory) => void; onInsertWithPrompt: () => void; onThemeToggle: () => void; onRemixToggle: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-3 flex items-center justify-center">
      {/* Figma: elevation-3, radius-md */}
      <div className="flex items-center rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-3">
        {/* Insert menu */}
        <div className="flex items-center p-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded pl-2 pr-3 py-1 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
                <Plus weight="regular" className="size-4" />
                Insert
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" sideOffset={12} className="w-[200px]">
              {/* Object section */}
              <div className="px-2 py-1">
                <span className="text-[length:var(--text-xs)] font-medium text-text-tertiary">Object</span>
              </div>
              <DropdownMenuItem onSelect={() => onObjectSelect("list")}>
                <ListBullets weight="regular" className="size-5 shrink-0 text-text-secondary" />
                List
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onObjectSelect("diagram")}>
                <FunnelSimple weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Diagram
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onObjectSelect("chart")}>
                <ChartPie weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Chart
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onObjectSelect("table")}>
                <Table weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Table
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onObjectSelect("concept")}>
                <CirclesThree weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Concept
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onObjectSelect("media")}>
                <Image weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Media
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onObjectSelect("text")}>
                <TextT weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Text
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onObjectSelect("people")}>
                <Users weight="regular" className="size-5 shrink-0 text-text-secondary" />
                People
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onObjectSelect("quote")}>
                <Quotes weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Quote
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Slide section */}
              <div className="px-2 py-1">
                <span className="text-[length:var(--text-xs)] font-medium text-text-tertiary">Slide</span>
              </div>
              <DropdownMenuItem onSelect={() => onInsertWithPrompt()}>
                <MagicWand weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Insert with a prompt
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CardsThree weight="regular" className="size-5 shrink-0 text-text-secondary" />
                Insert from template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="self-stretch w-px bg-border-secondary" />
        {/* Remix */}
        <div className="flex items-center p-1">
          <button
            onClick={onRemixToggle}
            className="flex items-center gap-2 rounded pl-2 pr-3 py-1 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover"
          >
            <ArrowsClockwise weight="regular" className="size-4" />
            Remix
          </button>
        </div>
        <div className="self-stretch w-px bg-border-secondary" />
        {/* Theme */}
        <div className="flex items-center p-1">
          <button
            onClick={onThemeToggle}
            className="flex items-center gap-2 rounded pl-2 pr-3 py-1 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover"
          >
            <Palette weight="regular" className="size-4" />
            Theme
          </button>
        </div>
        <div className="self-stretch w-px bg-border-secondary" />
        {/* Dots menu — Figma: p-[4px] container, p-[6px] insert = size-[28px] */}
        <div className="flex items-center p-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ToolbarIconButton>
                <DotsThreeVertical weight="bold" className="size-4" />
              </ToolbarIconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" sideOffset={12} alignOffset={-4} align="start" className="w-52">
              <DropdownMenuItem>
                <Copy weight="regular" className="size-5 text-text-secondary" />
                Duplicate slide
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus weight="regular" className="size-5 text-text-secondary" />
                Add slide below
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowUp weight="regular" className="size-5 text-text-secondary" />
                Move up
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowDown weight="regular" className="size-5 text-text-secondary" />
                Move down
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Palette weight="regular" className="size-5 text-text-secondary" />
                Slide colors
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Smiley weight="regular" className="size-5 text-text-secondary" />
                Reaction
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sticker weight="regular" className="size-5 text-text-secondary" />
                Add sticker
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag weight="regular" className="size-5 text-text-secondary" />
                Status
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCircle weight="regular" className="size-5 text-text-secondary" />
                Assign slide
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Notepad weight="regular" className="size-5 text-text-secondary" />
                Speaker notes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <EyeSlash weight="regular" className="size-5 text-text-secondary" />
                Hide slide
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash weight="regular" className="size-5 text-text-danger-primary" />
                Delete slide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Zoom panel                                                                */
/* -------------------------------------------------------------------------- */

function ZoomPanel() {
  return (
    /* Figma: w-[36px], rounded-[6px], p-[2px] sections */
    <div className="absolute bottom-3 right-3 flex w-9 flex-col items-center overflow-hidden rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-2">
      {/* Help */}
      <button className="flex w-full items-center justify-center p-2.5 transition-colors hover:bg-bg-elevated-hover">
        <Question weight="regular" className="size-4 text-text-primary" />
      </button>
      {/* Divider */}
      <div className="h-px w-full bg-border-secondary" />
      {/* Zoom */}
      <button className="flex w-full items-center p-0.5 transition-colors hover:bg-bg-elevated-hover">
        <div className="flex w-full flex-col items-center justify-center gap-1.5 rounded py-1.5">
          <MagnifyingGlass weight="regular" className="size-4 text-text-primary" />
          <span className="text-[length:var(--text-2xs)] leading-none text-text-primary">100%</span>
        </div>
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main editor shell                                                         */
/* -------------------------------------------------------------------------- */

export default function NewEditorPage() {
  const [activeSlide, setActiveSlide] = useState(1)
  const [objectSelectorOpen, setObjectSelectorOpen] = useState(false)
  const [objectSelectorCategory, setObjectSelectorCategory] = useState<ObjectCategory>("list")
  const [promptModalOpen, setPromptModalOpen] = useState(false)
  const [promptModalTitle, setPromptModalTitle] = useState("Insert new slide with a prompt")
  const [generatingSlideId, setGeneratingSlideId] = useState<number | null>(null)
  const [themePanelOpen, setThemePanelOpen] = useState(false)
  const [remixPanelOpen, setRemixPanelOpen] = useState(false)
  const pendingPanelRef = useRef<"remix" | "theme" | null>(null)

  const handleTogglePanel = (panel: "remix" | "theme") => {
    const isRemixOpen = remixPanelOpen
    const isThemeOpen = themePanelOpen

    if (panel === "remix") {
      if (isRemixOpen) {
        setRemixPanelOpen(false)
      } else if (isThemeOpen) {
        pendingPanelRef.current = "remix"
        setThemePanelOpen(false)
      } else {
        setRemixPanelOpen(true)
      }
    } else {
      if (isThemeOpen) {
        setThemePanelOpen(false)
      } else if (isRemixOpen) {
        pendingPanelRef.current = "theme"
        setRemixPanelOpen(false)
      } else {
        setThemePanelOpen(true)
      }
    }
  }

  const handlePanelExitComplete = () => {
    if (pendingPanelRef.current === "remix") {
      pendingPanelRef.current = null
      setRemixPanelOpen(true)
    } else if (pendingPanelRef.current === "theme") {
      pendingPanelRef.current = null
      setThemePanelOpen(true)
    }
  }
  const [slides, setSlides] = useState(SLIDES)
  const activeSlideIndex = slides.findIndex((s) => s.id === activeSlide)

  const handleInsertSlide = () => {
    const newId = Math.max(...slides.map((s) => s.id)) + 1
    const newSlide = { id: newId, label: `Generated Slide` }
    // Insert after the current active slide
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === activeSlide)
      const insertAt = idx === -1 ? prev.length : idx + 1
      return [...prev.slice(0, insertAt), newSlide, ...prev.slice(insertAt)]
    })
    setActiveSlide(newId)
    setGeneratingSlideId(newId)

    setTimeout(() => {
      setGeneratingSlideId(null)
      // Play completion sound
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2LkZeXk42GfnRtaGRiYWJkaG1yeH6EiY2QkZGPjIiDfXdxbGhlY2NlaGxwe4CFio6RkpKQjYmEfndxbGdkY2NlaW1yfIGGi4+RkpGPjIiDfXdxbGdkY2NlaW1yfIGGi4+RkpGPjImEfndxbGdkY2RlaW1yfIGHi4+RkpGPjImEfndybGdkY2RlaW1yfYGHjI+RkpGPjImEfndybWdlZGRlaW1yfYGHjI+Rk5KQjYmEf3hybWhlZGRmaW5zfYKHjI+Rk5KQjYmFf3hybWhlZGVmaW5zfYKHjI+Sk5KQjomFf3hybWhlZGVmaW5zfoKIjZCSkpKQjomFgHlzbmhmZWVnaW50foOIjZCSkpKRjomGgHlzbmhmZWVnaW50foOIjZCSkpKRj4qGgHlzbmhmZmZnaW50foOIjZCSkpKRj4qGgXp0b2lnZmZoam50f4OJjZCSkpKRj4qGgXp0b2lnZmZoam51f4OJjpGTk5KRj4uHgXp0b2lnZ2doam51f4SJjpGTk5KRkIuHgnt1cGpnZ2dpam51f4SJjpGTk5OSj4uIgnt1cGpoaGhpam92gISKjpGTk5OSj4yIgnt1cGpoaGhpbG92gISKjpGUk5OSj4yIgnt1cGpoaGhpbG92gISKjpKUk5OSkIyIg3x2cWtpaGlpbG93gYWKj5KUk5OSkIyJg3x2cWtpaGlpbG93gYWLj5KUlJOSkIyJg3x2cWtpaWlqbW93gYWLj5KUlJOSkI2Jg3x2cWtqaWlqbW94goaLj5KUlJOSkI2Jg3x2cWtqaWlqbW94goaLj5KUlJOSkI2JhHx3cmtqaWpqbW94goaMkJOUlJOSkY2JhH13cmxqamlqbW94goaMkJOUlJOSkY2JhH13cmxqamlqbm95goaMkJOVlJOTkY6KhH13cmxramprbnB5g4eMkJOVlJOTkY6KhX54c2xramprbnB5g4eMkJOVlJSTkY6KhX54c21sa2trbXB5g4eNkZSVlZSTkY6KhX54c21sa2trbXB6hIeNkZSVlZSTko+LhoB5dG1sa2trbXB6hIeNkZSVlZSTko+LhoB5dG1tbGxsbXF6hIiNkZSWlZSTko+LhoB5dG5tbGxsbXF6hYiOkpWWlZWTko+LhoF6dW5tbGxsbXF7hYiOkpWWlZWUko+MiIF6dW5tbW1tbXF7hYiOkpWWlpWUk5CMiIF6dW5ubW1tbnJ7hYmOkpWWlpWUk5CMiIF6dW5ubW1tbnJ7hYmOkpWWlpWUk5CMiYJ7dm9ubW1ubnJ8homPk5aXlpWUk5CNiYJ7dm9ubm5ubnJ8homPk5aXlpaUk5CNiYJ7dm9vbm5ubnJ8homPk5aXlpaUk5GOioN8d3Bvbm5ubnN8h4qPk5aXl5aVlJGOioN8d3Bvbm5ub3N9h4qPk5eXl5aVlJGOioN8d3Bvb29vb3N9h4qQlJeYl5aVlJGOioN8d3Bvb29vb3N9h4qQlJeYl5aVlJGPi4R9eHFwb29vb3N+iIuQlJeYl5aVlJGPi4R9eHFwb29vcHR+iIuQlJeYl5eVlJKPi4R9eHFwcHBwcHR+iIuRlZiYl5eVlJKPi4R9eHFxcHBwcHR+iIuRlZiYl5eWlJKQjIV+eXJxcHBwcHR/iYyRlZiZmJeWlZKQjIV+eXJxcHBwcXV/iYyRlZiZmJeWlZKQjIV+eXJxcXFxcXV/iYyRlZiZmJeWlZOQjIZ/enNycXFxcXVAiYySlpmZmJeWlZOQjIZ/enNycXFxcXVAiYySlpmZmJeWlZOQjYZ/enNycXFxcXZAio2SlpmZmJeXlZOQjYaAe3RzcnJycnZBio2SlpmamZeXlpOQjYaAe3RzcnJycnZBio2Tl5qamZeXlpOQjYaAe3RzcnJycnZBio2Tl5qamZeXlpORjoeBfHV0c3JycnZBio2Tl5qamZiXlpORjoeBfHV0c3Nzc3dBi46Tl5qamZiXlpORjoeBfHV0c3Nzc3dBi46UmJubmpiXl5SSj4eCfHV0c3Nzc3dCi46UmJubmpiYl5SSj4eCfHZ1dHR0dHhCi46UmJubmpiYl5SSj4eCfHZ1dHR0dHhCi46UmJubmpiYl5SSj4eCfHZ1dHR0dHhCi46UmJub")
      audio.volume = 0.3
      audio.play().catch(() => {})
      // Show toast notification
      toast("Slide generated successfully", {
        action: {
          label: "Go to slide",
          onClick: () => setActiveSlide(newId),
        },
      })
    }, 10000)
  }

  const handleObjectSelect = (category: ObjectCategory) => {
    setObjectSelectorCategory(category)
    setObjectSelectorOpen(true)
  }

  const pageRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  // When activeSlide changes from filmstrip click, scroll canvas to it
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || isScrolling.current) return
    const slideH = window.innerHeight - 64
    const gap = 16
    el.scrollTo({ top: activeSlideIndex * (slideH + gap), behavior: "smooth" })
  }, [activeSlide, activeSlideIndex])

  return (
    <div ref={pageRef} className="relative h-screen w-full bg-bg-quaternary">
      {/* Canvas area — native vertical scroll */}
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 snap-y snap-mandatory overflow-y-auto scroll-smooth py-6"
        style={{ scrollbarWidth: "none" }}
        onScroll={() => {
          const el = scrollContainerRef.current
          if (!el) return
          isScrolling.current = true
          clearTimeout((el as any)._scrollTimer)
          ;(el as any)._scrollTimer = setTimeout(() => { isScrolling.current = false }, 150)
          const slideH = window.innerHeight - 64
          const scrollPos = el.scrollTop + slideH / 2
          const newIndex = Math.floor(scrollPos / (slideH + 16))
          const clamped = Math.max(0, Math.min(newIndex, slides.length - 1))
          if (slides[clamped].id !== activeSlide) {
            setActiveSlide(slides[clamped].id)
          }
        }}
      >
        {slides.map((slide) => {
          const isActive = slide.id === activeSlide
          const isGenerating = slide.id === generatingSlideId
          return (
            <div
              key={slide.id}
              className="flex shrink-0 snap-center items-center justify-center"
              style={{ height: "calc(100vh - 64px)", paddingTop: 8, paddingBottom: 8 }}
            >
              <div
                className="relative overflow-hidden rounded-[var(--radius-md)] bg-white shadow-elevation-1 transition-opacity duration-300"
                style={{
                  height: "100%",
                  aspectRatio: "16 / 9",
                  maxWidth: "calc(100vw - 144px)",
                  opacity: isActive ? CANVAS_ACTIVE_OPACITY : CANVAS_INACTIVE_OPACITY,
                }}
              >
                {isGenerating ? (
                  <SlideSkeletonLoading />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-[length:var(--text-lg)] text-text-tertiary">{slide.label}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Top bar */}
      <EditorTopBar />

      {/* Filmstrip sidebar */}
      <Filmstrip activeSlide={activeSlide} onSlideSelect={setActiveSlide} slides={slides} generatingSlideId={generatingSlideId} onNewSlideWithPrompt={() => { setPromptModalTitle("New slide with a prompt"); setPromptModalOpen(true) }} />

      {/* Bottom bar / Generating bar */}
      <AnimatePresence mode="wait">
        {generatingSlideId !== null && activeSlide === generatingSlideId ? (
          <motion.div
            key="generating-bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-x-0 bottom-3 z-50 flex justify-center"
          >
            <div className="relative overflow-hidden rounded-[var(--radius-md)] bg-bg-elevated shadow-elevation-3">
              <div className="flex items-center px-3 py-2">
                <ShinyText text="Generating slides..." speed={1.5} delay={0} className="text-[length:var(--text-base)]" color="var(--text-tertiary)" shineColor="var(--text-primary)" />
              </div>
              {/* Animated brand border glow */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ border: "2px solid var(--bg-brand)", filter: "blur(3px)" }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ border: "1.5px solid var(--bg-brand)" }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="bottombar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <BottomBar onObjectSelect={handleObjectSelect} onInsertWithPrompt={() => { setPromptModalTitle("Insert new slide with a prompt"); setPromptModalOpen(true) }} onThemeToggle={() => handleTogglePanel("theme")} onRemixToggle={() => handleTogglePanel("remix")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remix panel */}
      <RemixPanel open={remixPanelOpen} onClose={() => setRemixPanelOpen(false)} onExitComplete={handlePanelExitComplete} />

      {/* Theme panel */}
      <ThemePanel open={themePanelOpen} onClose={() => setThemePanelOpen(false)} onExitComplete={handlePanelExitComplete} />

      {/* Zoom panel */}
      <ZoomPanel />

      {/* Insert with prompt modal */}
      <InsertPromptModal open={promptModalOpen} onOpenChange={setPromptModalOpen} onInsertSlide={handleInsertSlide} title={promptModalTitle} />

      {/* Object selector modal */}
      <ObjectSelectorModal
        open={objectSelectorOpen}
        onOpenChange={setObjectSelectorOpen}
        initialCategory={objectSelectorCategory}
      />
    </div>
  )
}
