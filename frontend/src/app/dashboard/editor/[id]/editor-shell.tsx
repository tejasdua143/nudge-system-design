"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  HouseSimple,
  ArrowUUpLeft,
  ArrowUUpRight,
  CaretDown,
  ChartBar,
  DotsThree,
  MagnifyingGlass,
  Question,
  TextT,
  ListBullets,
  Plus,
  Layout,
  DotsThreeVertical,
  Play,
  Export,
  ShareNetwork,
  PaintBrush,
  PlusIcon,
  CaretDownIcon,
  ListBulletsIcon,
  TextTIcon,
  PaintBrushIcon,
  ChartBarIcon,
  DotsThreeCircleIcon,
  HouseSimpleIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Document } from "../../data"
import {
  useRive,
  useStateMachineInput,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceBoolean,
    Layout as RiveLayout, Alignment as RiveAlignment, Fit as RiveFit,
} from "@rive-app/react-webgl2"

/* -------------------------------------------------------------------------- */
/*  Mock slide data                                                           */
/* -------------------------------------------------------------------------- */

const MOCK_SLIDES = [
  { id: 1, gradient: "from-[var(--gradient-slide-1a)] to-[var(--gradient-slide-1b)]" },
  { id: 2, gradient: "from-[var(--gradient-slide-2a)] to-[var(--gradient-slide-2b)]" },
  { id: 3, gradient: "from-[var(--gradient-slide-3a)] to-[var(--gradient-slide-3b)]" },
  { id: 4, gradient: "from-[var(--gradient-slide-4a)] to-[var(--gradient-slide-4b)]" },
  { id: 5, gradient: "from-[var(--gradient-slide-5a)] to-[var(--gradient-slide-5b)]" },
]

/* -------------------------------------------------------------------------- */
/*  Top bar                                                                   */
/* -------------------------------------------------------------------------- */

function EditorTopBar({ title }: { title: string }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-3 pt-2">
      {/* Left side */}
      <div className="relative flex h-10 gap-0.5 px-0.5 items-center rounded-lg border-none bg-bg-elevated shadow-elevation-2">
         <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/dashboard">
            <HouseSimpleIcon className="size-4" />
          </Link>
        </Button>
        <div className="h-full w-px bg-border-secondary" />
        <div className="flex max-w-[200px] items-center px-3 py-1">
          <span className="truncate text-[length:var(--text-base)] text-text-primary">{title}</span>
        </div>

       <div className="h-full w-px bg-border-secondary" />
          <Button variant="ghost" size="icon-sm">
            <ArrowUUpLeftIcon className="size-4" />
          </Button>
          <div className="h-full w-px bg-border-secondary" />
          <Button variant="ghost" size="icon-sm">
            <ArrowUUpRightIcon className="size-4" />
          </Button>
      </div>
      {/* <div className="flex items-center gap-2">
       
      </div> */}

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* User avatars */}
        <AvatarGroup>
          <Avatar>
            <AvatarFallback className="bg-paids-neutral-300" />
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-paids-brand-200" />
          </Avatar>
        </AvatarGroup>
        <div className="relative flex h-10 items-center gap-1.5 rounded-lg border-none bg-bg-elevated px-1 shadow-elevation-2">
        <Button variant="ghost" size="sm" className="rounded-sm text-[length:var(--text-base)] font-normal">
          <Play className="size-4" />
          Present
        </Button>
        <div className="h-full w-px bg-border-secondary" />
        <Button variant="ghost" size="sm" className="rounded-sm text-[length:var(--text-base)] font-normal">
          Share
        </Button>
        <div className="h-full w-px bg-border-secondary" />
        <Button variant="ghost" size="sm" className="rounded-sm text-[length:var(--text-base)] font-normal text-text-brand">
          <Export className="size-4 text-text-brand" />
          Export as PPT
        </Button>
        </div>

      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  Filmstrip panel                                                           */
/* -------------------------------------------------------------------------- */

function FilmstripPanel({
  slides,
  selectedIndex,
  onSelect,
}: {
  slides: typeof MOCK_SLIDES
  selectedIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <aside className="flex w-[180px] shrink-0 flex-col overflow-y-auto pt-3 pb-3 px-3 gap-3">
      <div className="relative flex shrink-0 flex-col rounded-lg bg-bg-elevated shadow-elevation-2">
        {/* New Slide button */}
        <div className="px-2 py-2">
          <Button variant="tertiary" size="md" className="w-full rounded-sm text-[length:var(--text-base)] font-normal">
            <PlusIcon weight="regular" className="size-4" />
            Add slide
          </Button>
        </div>
        {/* <div className="h-px w-full bg-border-secondary" /> */}
        {/* Slide thumbnails */}
        <div className="flex flex-col gap-3 px-2 pt-3 pb-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => onSelect(index)}
              className={cn(
                "relative overflow-hidden rounded transition-shadow",
                index === selectedIndex
                  ? "shadow-button-selected"
                  : "shadow-button-rest hover:shadow-elevation-1"
              )}
            >
              {/* Slide number badge */}
              <div className="absolute left-1 top-1 z-10 flex size-5 items-center justify-center rounded bg-black/40 text-[length:var(--text-2xs)] font-medium text-white backdrop-blur-sm">
                {index + 1}
              </div>
              {/* Thumbnail */}
              <div
                className={cn(
                  "aspect-video w-full bg-gradient-to-br",
                  slide.gradient
                )}
              />
              {/* Inner shadow overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--shadow-inner-1)]" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/*  Canvas area                                                               */
/* -------------------------------------------------------------------------- */

function CanvasArea({ slideGradient }: { slideGradient: string }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center pl-2 pt-3 pb-15 pr-16">
      {/* Clip container — maintains radius and elevation */}
      <div className="relative h-full max-h-full w-full max-w-full overflow-hidden rounded-md shadow-elevation-2">
        {/* Scrollable inner canvas */}
        <div className="h-full w-full overflow-auto">
          <div
            className={cn(
              "aspect-video min-h-full min-w-full bg-gradient-to-br",
              slideGradient
            )}
          />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Right tool panel                                                          */
/* -------------------------------------------------------------------------- */

function RightToolPanel() {
  return (
    <div className="absolute right-3 top-0 bottom-0 flex w-10 flex-col items-center justify-between pt-3 pb-3">
      {/* Top tools */}
      <div className="relative flex flex-col items-center rounded-lg bg-bg-elevated shadow-elevation-2">
        <button className="flex size-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated-hover hover:text-text-primary">
          <PaintBrushIcon className="size-4" />
        </button>
          <div className="w-full h-px bg-border-secondary" />
        <button className="flex size-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated-hover hover:text-text-primary">
          <ChartBarIcon className="size-4" />
        </button>
        <div className="w-full h-px bg-border-secondary" />
        <button className="flex size-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated-hover hover:text-text-primary">
          <DotsThreeCircleIcon className="size-5" />
        </button>
      </div>

      {/* Bottom tools */}
      <div className="relative flex flex-col items-center rounded-lg bg-bg-elevated shadow-elevation-2">
        <button className="flex size-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated-hover hover:text-text-primary">
          <MagnifyingGlass className="size-5" />
        </button>
        <div className="w-full h-px bg-border-secondary" />
        <button className="flex size-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated-hover hover:text-text-primary">
          <Question className="size-5" />
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Bottom toolbar                                                            */
/* -------------------------------------------------------------------------- */


function BtnRemixIcon({ isHovered }: { isHovered: boolean }) {
  const { rive, RiveComponent } = useRive({
    src: "/sparkle-icon.riv",
    stateMachines: "icon",
    autoplay: true,
    layout: new RiveLayout({ fit: RiveFit.Cover, alignment: RiveAlignment.Center }),
  })

  const viewModel = useViewModel(rive, { name: 'ViewModel1' });
  const viewModelInstance = useViewModelInstance(viewModel, { rive })
  const { setValue: setHover } = useViewModelInstanceBoolean(
    "bool",
    viewModelInstance
  )

  // Sync the external hover prop to the Rive boolean
  const prevHovered = React.useRef(false)
  React.useEffect(() => {
    if (prevHovered.current !== isHovered) {
      setHover(isHovered)
      prevHovered.current = isHovered
    }
  }, [isHovered, setHover])

  return <RiveComponent className="h-6 w-6" />
}

function BtnRemixBg({ isHovered }: { isHovered: boolean }) {
  const { rive, RiveComponent } = useRive({
    src: "/button-remix.riv",
    stateMachines: "hover",
    autoplay: true,
    layout: new RiveLayout({ fit: RiveFit.Cover, alignment: RiveAlignment.Center }),
  })

  const viewModel = useViewModel(rive, { name: 'ViewModel1' });
  const viewModelInstance = useViewModelInstance(viewModel, { rive })
  const { setValue: setHover } = useViewModelInstanceBoolean(
    "bool",
    viewModelInstance
  )

  // Sync the external hover prop to the Rive boolean
  const prevHovered = React.useRef(false)
  React.useEffect(() => {
    if (prevHovered.current !== isHovered) {
      setHover(isHovered)
      prevHovered.current = isHovered
    }
  }, [isHovered, setHover])

  return <RiveComponent className="h-10 w-full" />
}

function BottomToolbar() {
  const [remixHovered, setRemixHovered] = useState(false)

  return (
    <div className="absolute inset-x-0 bottom-3 flex items-center justify-center">
      <div className="flex items-center gap-2">
        {/* Text tools */}
        <div className="relative flex h-10 items-center gap-1.5 rounded-lg bg-bg-elevated px-1.5 shadow-elevation-2">
          <button className="flex items-center gap-1.5 rounded px-2 py-1 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
            <TextTIcon className="size-4" />
            Title
            <CaretDownIcon weight="bold" className="size-3 text-text-tertiary" />
          </button>
          <div className="h-full w-px bg-border-secondary" />
          <button className="flex items-center gap-1.5 rounded px-2 py-1 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
            <ListBulletsIcon className="size-5" />
            List
            <CaretDownIcon weight="bold" className="size-3 text-text-tertiary" />
          </button>
          <div className="h-full w-px bg-border-secondary" />
          <button className="flex items-center gap-1.5 rounded px-2 py-1.5 text-[length:var(--text-base)] text-text-primary transition-colors hover:bg-bg-elevated-hover">
            <PlusIcon weight="regular" className="size-4" />
            Add object
          </button>
        </div>

        {/* Layouts */}
        <div className="relative flex h-10 items-center gap-1.5 rounded-lg bg-bg-elevated px-2.5 shadow-elevation-2">
          <Layout weight="regular" className="size-4" />
          <span className="text-[length:var(--text-base)] text-text-primary">Layouts</span>
        </div>

        {/* Remix */}
        <button
          className="cursor-pointer overflow-hidden h-10 w-22 rounded-lg bg-bg-elevated shadow-elevation-2 transition-colors hover:bg-bg-elevated-hover"
          onMouseEnter={() => setRemixHovered(true)}
          onMouseLeave={() => setRemixHovered(false)}
        >
           <div className="absolute z-10 flex items-center h-10  gap-1 px-2 py-1 text-[length:var(--text-base)] text-white">
             <BtnRemixIcon isHovered={remixHovered} />
            <span className="y">Remix</span>
          </div>
          <BtnRemixBg isHovered={remixHovered} />

          
        </button>


      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Editor shell                                                              */
/* -------------------------------------------------------------------------- */

interface EditorShellProps {
  document: Document
}

export function EditorShell({ document }: EditorShellProps) {
  const [selectedSlide, setSelectedSlide] = useState(0)
  const currentSlide = MOCK_SLIDES[selectedSlide]

  return (
    <div className="flex h-screen flex-col bg-bg-secondary">
      <EditorTopBar title={document.title} />

      <div className="relative flex flex-1 overflow-hidden">
        <FilmstripPanel
          slides={MOCK_SLIDES}
          selectedIndex={selectedSlide}
          onSelect={setSelectedSlide}
        />

        <div className="relative flex min-w-0 flex-1">
          <CanvasArea slideGradient={currentSlide.gradient} />
          <BottomToolbar />
        </div>

        <RightToolPanel />
      </div>
    </div>
  )
}
