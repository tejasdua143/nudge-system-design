export interface Document {
  id: string
  title: string
  status: string
  author: string
  gradient: string
}

export const RECENT_DOCS: Document[] = [
  {
    id: "mckinsey-acquires-s4g",
    title: "McKinsey acquires S4G Consulting to help businesses ignite growth",
    status: "In Drafts",
    author: "Created by You",
    gradient: "from-[var(--gradient-slide-1a)] to-[var(--gradient-slide-1b)]",
  },
  {
    id: "aethelgard-living",
    title: "Aethelgard Living - The New Standard of Legacy",
    status: "In Drafts",
    author: "Created by You",
    gradient: "from-[var(--gradient-slide-2a)] to-[var(--gradient-slide-2b)]",
  },
  {
    id: "anatomy-of-the-pitch",
    title: "The Anatomy of the Pitch",
    status: "In Drafts",
    author: "Created by You",
    gradient: "from-[var(--gradient-slide-3a)] to-[var(--gradient-slide-3b)]",
  },
  {
    id: "q4-2025-revenue-report",
    title: "Q4 2025 Revenue Report - Executive Summary",
    status: "In Drafts",
    author: "Created by You",
    gradient: "from-[var(--gradient-slide-4a)] to-[var(--gradient-slide-4b)]",
  },
  {
    id: "product-launch-strategy",
    title: "Product Launch Strategy - Series B Roadmap",
    status: "Shared",
    author: "Created by You",
    gradient: "from-[var(--gradient-slide-5a)] to-[var(--gradient-slide-5b)]",
  },
  {
    id: "brand-guidelines-2026",
    title: "Brand Guidelines 2026 - Visual Identity Update",
    status: "In Drafts",
    author: "Created by You",
    gradient: "from-[var(--gradient-slide-6a)] to-[var(--gradient-slide-6b)]",
  },
  {
    id: "customer-onboarding-flow",
    title: "Customer Onboarding Flow - UX Research Findings",
    status: "Shared",
    author: "Created by You",
    gradient: "from-[var(--gradient-slide-7a)] to-[var(--gradient-slide-7b)]",
  },
  {
    id: "engineering-team-offsite",
    title: "Engineering Team Offsite - Planning Deck",
    status: "In Drafts",
    author: "Created by You",
    gradient: "from-[var(--gradient-slide-8a)] to-[var(--gradient-slide-8b)]",
  },
]
