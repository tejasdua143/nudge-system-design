import {
  Mail,
  Search,
  ArrowRight,
  Plus,
  Download,
  Heart,
  Star,
  ChevronRight,
  Send,
  Lock,
  Eye,
  X,
  ChevronDown,
  Calendar,
  User,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const ICON_MAP: Record<string, LucideIcon> = {
  Mail,
  Search,
  ArrowRight,
  Plus,
  Download,
  Heart,
  Star,
  ChevronRight,
  Send,
  Lock,
  Eye,
  X,
  ChevronDown,
  Calendar,
  User,
}

export const ICON_NAMES = Object.keys(ICON_MAP)

export function getIcon(name: string): LucideIcon | null {
  if (name === "none") return null
  return ICON_MAP[name] ?? null
}

export const LEADING_ICON_OPTIONS = [
  "none",
  "Mail",
  "Search",
  "Plus",
  "Download",
  "Heart",
  "Star",
  "Send",
  "Lock",
  "User",
  "Calendar",
]

export const TRAILING_ICON_OPTIONS = [
  "none",
  "ArrowRight",
  "ChevronRight",
  "ChevronDown",
  "Download",
  "Send",
  "Eye",
  "X",
  "Search",
]
