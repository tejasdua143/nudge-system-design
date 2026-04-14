"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

const pages = [
  { href: "/dashboard", label: "dashboard", description: "app overview & analytics" },
  { href: "/docs", label: "docs", description: "component documentation" },
  { href: "/developer", label: "developer", description: "api dashboard" },
  { href: "/developer/playground", label: "playground", description: "api playground" },
  { href: "/api-docs", label: "api-docs", description: "api & mcp documentation" },
  { href: "/login", label: "login", description: "authentication" },
  { href: "/signup", label: "signup", description: "create account" },
  { href: "/export", label: "export", description: "export modal" },
  { href: "/create", label: "create", description: "create presentation flow" },
  { href: "/new-editor", label: "new-editor", description: "editor prototype" },
  { href: "/new-editor-v1", label: "new-editor-v1", description: "editor v1 variant" },
];

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-primary font-[family-name:var(--font-geist-mono)]">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 text-[length:var(--text-xs)] text-text-tertiary transition-colors hover:text-text-primary"
      >
        {theme === "dark" ? "light" : "dark"}
      </button>

      <main className="flex flex-col items-center gap-16 px-6">
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-medium tracking-tight text-text-primary">
            PAIDS
          </h1>
          <p className="text-[length:var(--text-base)] text-text-tertiary">
            design system v0.1
          </p>
        </motion.div>

        <nav className="flex flex-col gap-1 w-full max-w-xs">
          {pages.map((page, i) => (
            <motion.div
              key={page.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1, ease: "easeOut" }}
            >
              <Link
                href={page.href}
                className="group flex items-baseline justify-between gap-6 rounded-md px-3 py-2 text-[length:var(--text-base)] transition-colors hover:bg-bg-secondary"
              >
                <span className="text-text-primary group-hover:text-text-brand">
                  ~/{page.label}
                </span>
                <span className="text-[length:var(--text-xs)] text-text-tertiary">
                  {page.description}
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.p
          className="text-[length:var(--text-xs)] text-text-quaternary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          presentations.ai
        </motion.p>
      </main>
    </div>
  );
}
