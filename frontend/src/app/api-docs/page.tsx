"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Rocket,
  Code,
  FileText,
  Lightning,
  Robot,
  Key,
  Warning,
  ArrowSquareOut,
  Copy,
  Check,
  Terminal,
  Globe,
  FilePdf,
  Presentation,
  Image,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"

const API_ENDPOINTS = [
  {
    method: "POST",
    path: "/api/v1/topic/document",
    title: "Create from Topic",
    description: "Generate multi-slide presentations from a topic using AI.",
    tags: ["AI", "Topic"],
  },
  {
    method: "POST",
    path: "/api/v1/topic/singleslide",
    title: "Create Single Slide",
    description: "Generate a focused single-slide presentation on a topic.",
    tags: ["AI", "Slide"],
  },
  {
    method: "POST",
    path: "/api/v1/document/file",
    title: "Create from File",
    description: "Transform uploaded files (PDF, DOCX, etc.) into presentations.",
    tags: ["File", "Upload"],
  },
  {
    method: "POST",
    path: "/api/v1/content/document",
    title: "Create from Content",
    description: "Create presentations from structured JSON content.",
    tags: ["Content", "Beta"],
  },
]

const EXPORT_TYPES = [
  { type: "ppt", label: "PowerPoint", icon: Presentation },
  { type: "pptx", label: "PowerPoint XML", icon: Presentation },
  { type: "pdf", label: "PDF Export", icon: FilePdf },
  { type: "share", label: "Share Link", icon: Globe },
  { type: "image", label: "Image Slides", icon: Image },
]

const NAV_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "quickstart", label: "Quick Start" },
  { id: "authentication", label: "Authentication" },
  { id: "endpoints", label: "API Endpoints" },
  { id: "exports", label: "Export Types" },
  { id: "mcp", label: "MCP Integration" },
  { id: "errors", label: "Error Handling" },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="absolute top-3 right-3 rounded-[var(--radius-sm)] p-1.5 text-text-tertiary transition-colors hover:bg-bg-elevated-hover hover:text-text-secondary"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  return (
    <div className="relative rounded-[var(--radius-md)] border border-border-secondary bg-bg-secondary-inverted">
      <div className="flex items-center gap-2 border-b border-border-secondary px-4 py-2">
        <Terminal size={12} className="text-text-tertiary" />
        <span className="text-[length:var(--text-2xs)] text-text-tertiary">{language}</span>
      </div>
      <CopyButton text={code} />
      <pre className="overflow-x-auto p-4 text-[length:var(--text-xs)] leading-relaxed text-text-primary-inverted">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Sidebar nav */}
      <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 border-r border-border-secondary bg-bg-secondary p-4 lg:block">
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[length:var(--text-xs)] text-text-tertiary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>
        <div className="mb-4">
          <span className="text-[length:var(--text-xs)] font-semibold uppercase tracking-wider text-text-tertiary">
            API Documentation
          </span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setActiveSection(section.id)}
              className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-[length:var(--text-sm)] transition-colors ${
                activeSection === section.id
                  ? "bg-bg-brand-selected font-medium text-text-brand"
                  : "text-text-secondary hover:bg-bg-elevated-hover hover:text-text-primary"
              }`}
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="mt-8 rounded-[var(--radius-md)] border border-border-secondary bg-bg-elevated p-3">
          <p className="mb-2 text-[length:var(--text-xs)] font-medium text-text-primary">Full Docs</p>
          <p className="mb-3 text-[length:var(--text-2xs)] text-text-tertiary">
            View the complete API documentation with interactive examples.
          </p>
          <a
            href="https://dev-apis.presentations.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[length:var(--text-xs)] text-text-brand transition-colors hover:text-text-brand-hover"
          >
            dev-apis.presentations.ai
            <ArrowSquareOut size={12} />
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[800px] px-6 py-12 lg:px-12">
          {/* Header */}
          <section id="overview" className="mb-16">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-[length:var(--text-3xl)] font-semibold tracking-tight text-text-primary">
                Developer API
              </h1>
              <Badge variant="secondary" className="text-[length:var(--text-2xs)]">Beta</Badge>
            </div>
            <p className="mb-8 max-w-[560px] text-[length:var(--text-base)] leading-relaxed text-text-secondary">
              Create AI-powered presentations programmatically through our REST API or conversationally via MCP integration with Claude Desktop.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-border-secondary bg-bg-elevated p-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-brand-selected">
                  <Code size={16} className="text-text-brand" />
                </div>
                <div>
                  <p className="text-[length:var(--text-sm)] font-medium text-text-primary">REST API</p>
                  <p className="text-[length:var(--text-xs)] text-text-tertiary">
                    HTTP endpoints with JSON responses and Bearer token auth.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-border-secondary bg-bg-elevated p-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-brand-selected">
                  <Robot size={16} className="text-text-brand" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[length:var(--text-sm)] font-medium text-text-primary">MCP Server</p>
                    <Badge variant="default" className="text-[length:var(--text-2xs)]">Recommended</Badge>
                  </div>
                  <p className="text-[length:var(--text-xs)] text-text-tertiary">
                    Natural language creation via Claude Desktop.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section id="quickstart" className="mb-16">
            <h2 className="mb-4 text-[length:var(--text-xl)] font-semibold text-text-primary">Quick Start</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand text-[length:var(--text-2xs)] font-semibold text-text-white">1</span>
                <div className="flex-1">
                  <p className="mb-1 text-[length:var(--text-sm)] font-medium text-text-primary">Get your API key</p>
                  <p className="text-[length:var(--text-xs)] text-text-secondary">
                    Sign up at the developer portal and generate an API key. You get 200 free credits.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand text-[length:var(--text-2xs)] font-semibold text-text-white">2</span>
                <div className="flex-1">
                  <p className="mb-2 text-[length:var(--text-sm)] font-medium text-text-primary">Make your first call</p>
                  <CodeBlock
                    language="curl"
                    code={`curl -X POST https://api.presentations.ai/api/v1/topic/document \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "Introduction to AI",
    "slide_count": 10,
    "type": "pptx"
  }'`}
                  />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-brand text-[length:var(--text-2xs)] font-semibold text-text-white">3</span>
                <div className="flex-1">
                  <p className="mb-2 text-[length:var(--text-sm)] font-medium text-text-primary">Get your presentation</p>
                  <CodeBlock
                    language="json"
                    code={`{
  "status": 0,
  "message": "success",
  "docurl": "https://cdn.presentations.ai/...",
  "docid": "abc123"
}`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" className="mb-16">
            <h2 className="mb-4 text-[length:var(--text-xl)] font-semibold text-text-primary">Authentication</h2>
            <p className="mb-4 text-[length:var(--text-sm)] text-text-secondary">
              All API requests require a Bearer token in the Authorization header.
            </p>
            <CodeBlock
              language="http"
              code={`Authorization: Bearer YOUR_API_KEY`}
            />
            <div className="mt-4 flex items-start gap-2 rounded-[var(--radius-md)] border border-border-secondary bg-bg-secondary p-3">
              <Key size={14} className="mt-0.5 shrink-0 text-text-tertiary" />
              <p className="text-[length:var(--text-xs)] text-text-secondary">
                Generate API keys from the <Link href="/developer/api-keys" className="text-text-brand hover:text-text-brand-hover">developer portal</Link>. Keep your keys secure and never expose them in client-side code.
              </p>
            </div>
          </section>

          {/* Endpoints */}
          <section id="endpoints" className="mb-16">
            <h2 className="mb-4 text-[length:var(--text-xl)] font-semibold text-text-primary">API Endpoints</h2>
            <div className="space-y-3">
              {API_ENDPOINTS.map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="rounded-[var(--radius-lg)] border border-border-secondary bg-bg-elevated p-4 transition-colors hover:border-border-primary"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-[var(--radius-sm)] bg-bg-success px-1.5 py-0.5 text-[length:var(--text-2xs)] font-semibold text-text-white">
                      {endpoint.method}
                    </span>
                    <code className="text-[length:var(--text-xs)] font-medium text-text-primary">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="mb-2 text-[length:var(--text-xs)] text-text-secondary">
                    {endpoint.description}
                  </p>
                  <div className="flex gap-1.5">
                    {endpoint.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[length:var(--text-2xs)]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Export Types */}
          <section id="exports" className="mb-16">
            <h2 className="mb-4 text-[length:var(--text-xl)] font-semibold text-text-primary">Export Types</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {EXPORT_TYPES.map((exp) => (
                <div key={exp.type} className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-border-secondary p-3 text-center">
                  <exp.icon size={20} className="text-text-secondary" />
                  <div>
                    <code className="text-[length:var(--text-2xs)] font-medium text-text-primary">{exp.type}</code>
                    <p className="text-[length:var(--text-2xs)] text-text-tertiary">{exp.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MCP Integration */}
          <section id="mcp" className="mb-16">
            <h2 className="mb-4 text-[length:var(--text-xl)] font-semibold text-text-primary">MCP Integration</h2>
            <p className="mb-4 text-[length:var(--text-sm)] text-text-secondary">
              Connect Presentations.AI to Claude Desktop for natural language presentation creation.
            </p>
            <CodeBlock
              language="json"
              code={`{
  "mcpServers": {
    "presentations-ai": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://dev-apis.presentations.ai/mcp",
        "--header",
        "Authorization: Bearer YOUR_API_KEY"
      ]
    }
  }
}`}
            />
            <div className="mt-4 rounded-[var(--radius-md)] border border-border-secondary bg-bg-secondary p-4">
              <p className="mb-2 text-[length:var(--text-xs)] font-medium text-text-primary">Example prompts</p>
              <ul className="space-y-1.5 text-[length:var(--text-xs)] text-text-secondary">
                <li>&ldquo;Create a 10-slide presentation on digital marketing trends&rdquo;</li>
                <li>&ldquo;Generate a PDF presentation about AI in healthcare with 5 slides&rdquo;</li>
                <li>&ldquo;Make a pitch deck for a SaaS startup&rdquo;</li>
              </ul>
            </div>
          </section>

          {/* Error Handling */}
          <section id="errors" className="mb-16">
            <h2 className="mb-4 text-[length:var(--text-xl)] font-semibold text-text-primary">Error Handling</h2>
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-secondary">
              <table className="w-full text-left text-[length:var(--text-xs)]">
                <thead>
                  <tr className="border-b border-border-secondary bg-bg-secondary">
                    <th className="px-4 py-2.5 font-medium text-text-primary">Code</th>
                    <th className="px-4 py-2.5 font-medium text-text-primary">Type</th>
                    <th className="px-4 py-2.5 font-medium text-text-primary">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: "401", type: "Authentication", desc: "Invalid or missing API key" },
                    { code: "402", type: "Payment", desc: "Insufficient credits or suspended account" },
                    { code: "400", type: "Validation", desc: "Invalid parameters (empty topic, bad slide count)" },
                    { code: "500", type: "Server", desc: "Internal error — retry after a few seconds" },
                  ].map((err) => (
                    <tr key={err.code} className="border-b border-border-secondary last:border-0">
                      <td className="px-4 py-2.5">
                        <code className="rounded-[var(--radius-sm)] bg-bg-danger-inverted px-1.5 py-0.5 text-[length:var(--text-2xs)] font-medium text-text-danger-primary">
                          {err.code}
                        </code>
                      </td>
                      <td className="px-4 py-2.5 text-text-primary">{err.type}</td>
                      <td className="px-4 py-2.5 text-text-secondary">{err.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer link */}
          <div className="border-t border-border-secondary pt-6 text-center">
            <p className="text-[length:var(--text-xs)] text-text-tertiary">
              For complete API reference with interactive examples, visit{" "}
              <a
                href="https://dev-apis.presentations.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-brand hover:text-text-brand-hover"
              >
                dev-apis.presentations.ai
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
