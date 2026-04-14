import { TableOfContents } from "@/components/docs/table-of-contents"
import { ThemeConfigPanel } from "@/components/docs/theme-config-panel"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <TableOfContents />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <ThemeConfigPanel />
    </div>
  )
}
