// Lightweight theme manager with CSS variables (light/dark/system)
(function () {
  const storageKey = "pai-docs-theme";

  const themes = {
    light: {
      "--color-orange-gradient": "linear-gradient(90deg, #FF5500 0%, #CB4609 100%)",
      "--color-header-bg": "var(--color-orange-gradient)",
      "--color-header-border": "#0c357b",
      "--color-header-control-border": "rgba(255,255,255,0.5)",
      "--color-header-control-border-hover": "rgba(255,255,255,0.85)",
      "--color-header-text": "#ffffff",
      "--color-chip-active": "var(--color-orange-gradient)",
      "--color-chip-active-text": "#FF5500",
      "--color-chip-hover": "#CB4609",
      "--color-surface": "#ffffff",
      "--color-surface-muted": "#f5f6fa",
      "--color-text": "#0f172a",
      "--color-text-muted": "#334155",
      "--color-sidebar-active": "#e0e7ff",
  },
  dark: {
      "--color-orange-gradient": "linear-gradient(90deg, #FF5500 0%, #CB4609 100%)",
      "--color-header-bg": "var(--color-orange-gradient)",
      "--color-header-border": "#102a62",
      "--color-header-control-border": "rgba(255,255,255,0.5)",
      "--color-header-control-border-hover": "rgba(255,255,255,0.85)",
      "--color-header-text": "#e5e7eb",
      "--color-chip-active": "var(--color-orange-gradient)",
      "--color-chip-active-text": "#FF5500",
      "--color-chip-hover": "#CB4609",
      "--color-surface": "#0f172a",
      "--color-surface-muted": "#111827",
      "--color-text": "#e5e7eb",
      "--color-text-muted": "#cbd5f5",
      "--color-sidebar-active": "#1f2937",
  },
  };

  // Inject style tag to override HTML inline styles - must be first
  const overrideStyle = document.createElement("style");
  overrideStyle.id = "theme-override-styles";
  overrideStyle.textContent = `
    /* Override HTML inline style tags for admonitions */
    .admonition-info[style*="background-color"],
    .admonition-success[style*="background-color"],
    .admonition-warning[style*="background-color"],
    .admonition-tip[style*="background-color"] {
      background-color: var(--color-surface-muted) !important;
    }
    :root[data-theme="dark"] .admonition-info[style*="background-color"],
    :root[data-theme="dark"] .admonition-success[style*="background-color"],
    :root[data-theme="dark"] .admonition-warning[style*="background-color"],
    :root[data-theme="dark"] .admonition-tip[style*="background-color"] {
      background-color: #1f2937 !important;
    }
  `;
  document.head.insertBefore(overrideStyle, document.head.firstChild);

  // Global CSS overrides for common elements and Tailwind utility colors
  const style = document.createElement("style");
  style.textContent = `
:root { 
  --doc-header-height: 104px; 
}
html {
  scroll-behavior: smooth;
}
@media (max-width: 768px) {
  :root { --doc-header-height: 56px; }
}
body { background: var(--color-surface); color: var(--color-text); overflow-x: hidden; }

/* Force white text in header navigation section */
header, header *, header a, header button, header span, header nav, header nav * { color: #ffffff !important; }
header svg { color: #ffffff !important; }
header button svg, header a svg { color: #ffffff !important; }

/* Theme-aware text colors - comprehensive override */
main, main *, section, section *, article, article *, 
h1, h2, h3, h4, h5, h6, p, li, span, div, a, label, td, th, 
.text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-gray-400,
.text-black, .text-slate-900, .text-slate-800, .text-slate-700 { 
  color: var(--color-text) !important; 
}

/* Force white text in dark mode for all content */
:root[data-theme="dark"] main, 
:root[data-theme="dark"] main *, 
:root[data-theme="dark"] section, 
:root[data-theme="dark"] section *,
:root[data-theme="dark"] article,
:root[data-theme="dark"] article *,
:root[data-theme="dark"] h1, 
:root[data-theme="dark"] h2, 
:root[data-theme="dark"] h3, 
:root[data-theme="dark"] h4, 
:root[data-theme="dark"] h5, 
:root[data-theme="dark"] h6, 
:root[data-theme="dark"] p, 
:root[data-theme="dark"] li, 
:root[data-theme="dark"] span, 
:root[data-theme="dark"] div:not(header div):not(header *),
:root[data-theme="dark"] .text-gray-900, 
:root[data-theme="dark"] .text-gray-800, 
:root[data-theme="dark"] .text-gray-700, 
:root[data-theme="dark"] .text-gray-600, 
:root[data-theme="dark"] .text-gray-500 {
  color: #ffffff !important;
}

/* Override text-white in content areas (not header) */
main .text-white, section .text-white, article .text-white,
main span.text-white, section span.text-white, article span.text-white,
main div.text-white, section div.text-white, article div.text-white,
main p.text-white, section p.text-white, article p.text-white {
  color: var(--color-text) !important;
}

/* Keep header text white */
header .text-white, header span.text-white, header div.text-white {
  color: #ffffff !important;
}

/* Gradient orange - use variable for header and active chip */
:root { --color-orange-gradient: linear-gradient(90deg, #FF5500 0%, #CB4609 100%); }
.chip-active-gradient { background: var(--color-orange-gradient) !important; color: #ffffff !important; }
.sidebar-active-gradient { background: var(--color-orange-gradient) !important; color: #ffffff !important; }
/* Link colors - use solid for text */
.text-blue-600, .text-blue-800, .text-blue-900 { color: var(--color-chip-active-text) !important; }
.text-green-600, .text-green-800, .text-green-900 { color: var(--color-text) !important; }
.text-indigo-600, .text-indigo-800, .text-indigo-900 { color: var(--color-text) !important; }
.text-yellow-600, .text-yellow-800, .text-yellow-900 { color: var(--color-text) !important; }

/* Admonition text colors - override colored text classes inside admonitions */
.admonition .text-blue-800, .admonition .text-blue-900 { color: var(--color-text) !important; }
.admonition .text-yellow-800, .admonition .text-yellow-900 { color: var(--color-text) !important; }
.admonition .text-green-800, .admonition .text-green-900 { color: var(--color-text) !important; }
.admonition .text-indigo-800, .admonition .text-indigo-900 { color: var(--color-text) !important; }

:root[data-theme="dark"] .admonition .text-blue-800,
:root[data-theme="dark"] .admonition .text-blue-900,
:root[data-theme="dark"] .admonition .text-yellow-800,
:root[data-theme="dark"] .admonition .text-yellow-900,
:root[data-theme="dark"] .admonition .text-green-800,
:root[data-theme="dark"] .admonition .text-green-900,
:root[data-theme="dark"] .admonition .text-indigo-800,
:root[data-theme="dark"] .admonition .text-indigo-900 {
  /* Use a light, high-contrast color in dark mode */
  color:#fef3c7 !important;
}

/* Theme-aware background colors */
.bg-white { background: var(--color-surface) !important; }
.bg-gray-50, .bg-gray-100, .bg-gray-200 { background: var(--color-surface-muted) !important; }
.bg-light-accent { background: var(--color-sidebar-active) !important; }
:root[data-theme="dark"] .bg-gray-50, 
:root[data-theme="dark"] .bg-gray-100, 
:root[data-theme="dark"] .bg-gray-200 {
  background: #1f2937 !important;
}

/* Theme-aware borders - light gray instead of dark */
.border-gray-200, .border-gray-300 { border-color: #e5e7eb !important; }
.border-l, .border-r, .border-t, .border-b { border-color: #e5e7eb !important; }
:root[data-theme="dark"] .border-gray-200, 
:root[data-theme="dark"] .border-gray-300,
:root[data-theme="dark"] .border-l, 
:root[data-theme="dark"] .border-r, 
:root[data-theme="dark"] .border-t, 
:root[data-theme="dark"] .border-b { 
  border-color: #374151 !important; 
}

/* Sidebar styling */
aside { background: var(--color-surface) !important; }
aside h2, aside h3, aside h4 { color: var(--color-text-muted) !important; }
aside a, aside span, aside div, aside p, aside li { color: var(--color-text) !important; }
/* Left sidebar: keep hover background */
.flex.flex-col.lg\\:flex-row > aside:first-of-type a:hover { 
  background: var(--color-sidebar-active) !important; 
}
/* Right sidebar (table of contents): no hover background */
.flex.flex-col.lg\\:flex-row > aside:last-of-type a:hover { 
  background: transparent !important; 
}
/* Override any white text in sidebars */
aside .text-white { color: var(--color-text) !important; }
/* Active sidebar links (bg-light-accent) should have white text in dark mode */
:root[data-theme="dark"] aside:first-of-type a.bg-light-accent,
:root[data-theme="dark"] aside:first-of-type a.bg-light-accent:hover,
:root[data-theme="dark"] aside:first-of-type a:hover {
  color: #ffffff !important;
}
/* Override any blue text colors in active/hovered sidebar links */
:root[data-theme="dark"] aside:first-of-type a.bg-light-accent.text-blue-600,
:root[data-theme="dark"] aside:first-of-type a.bg-light-accent.text-blue-800,
:root[data-theme="dark"] aside:first-of-type a.bg-light-accent.text-blue-900,
:root[data-theme="dark"] aside:first-of-type a:hover.text-blue-600,
:root[data-theme="dark"] aside:first-of-type a:hover.text-blue-800,
:root[data-theme="dark"] aside:first-of-type a:hover.text-blue-900 {
  color: #ffffff !important;
}

/* Code blocks */
pre, pre *, code, code * { 
  background: var(--color-surface-muted) !important; 
  color: var(--color-text) !important; 
  white-space: pre-wrap; 
  word-break: break-word; 
}
:root[data-theme="dark"] pre, :root[data-theme="dark"] pre * { 
  background: #0b1224 !important; 
  color: #e5e7eb !important; 
}
:root[data-theme="dark"] code, :root[data-theme="dark"] code * { 
  background: #111827 !important; 
  color: #e5e7eb !important; 
}

/* Details/Summary (Collapsible sections) */
details, details summary, details > div, details > div * {
  color: var(--color-text) !important;
}
details summary {
  background: var(--color-surface-muted) !important;
  color: var(--color-text) !important;
}
details > div {
  background: var(--color-surface-muted) !important;
  color: var(--color-text) !important;
}
:root[data-theme="dark"] details {
  color: #ffffff !important;
}
:root[data-theme="dark"] details summary {
  background: #1f2937 !important;
  color: #ffffff !important;
}
:root[data-theme="dark"] details summary * {
  color: #ffffff !important;
}
:root[data-theme="dark"] details > div {
  background: #1f2937 !important;
  color: #ffffff !important;
}
:root[data-theme="dark"] details > div * {
  color: #ffffff !important;
}
:root[data-theme="dark"] details summary:hover {
  background: #374151 !important;
}
/* Override inline styles in HTML for details - must override style tag */
:root[data-theme="dark"] details summary {
  background-color: #1f2937 !important;
  background: #1f2937 !important;
}
:root[data-theme="dark"] details summary:hover {
  background-color: #374151 !important;
  background: #374151 !important;
}
:root[data-theme="dark"] details > div {
  background-color: #1f2937 !important;
  background: #1f2937 !important;
}
:root[data-theme="dark"] details[open] summary {
  border-bottom-color: #374151 !important;
}

/* Tables */
table, table *, table td, table th, table tr, table thead, table tbody { 
  color: var(--color-text) !important; 
  border-color: var(--color-header-border) !important; 
}
/* Prevent field names like slideCount from breaking letter-by-letter inside tables */
table code, table td code, table th code {
  white-space: nowrap !important;
  word-break: normal !important;
}
table .text-white { color: var(--color-text) !important; }
table thead, table thead * {
  background: var(--color-surface-muted) !important;
  color: var(--color-text) !important;
}
table tbody, table tbody * {
  background: var(--color-surface) !important;
  color: var(--color-text) !important;
}
:root[data-theme="dark"] table thead, :root[data-theme="dark"] table thead * {
  background: #1f2937 !important;
  color: #ffffff !important;
}
:root[data-theme="dark"] table tbody, :root[data-theme="dark"] table tbody * {
  background: #0f172a !important;
  color: #ffffff !important;
}

/* Links */
a { color: var(--color-chip-active) !important; }
a:hover { color: var(--color-chip-hover) !important; }

/* Admonitions/Info boxes - Override all hardcoded styles from HTML */
.admonition { 
  background: var(--color-surface-muted) !important; 
  background-color: var(--color-surface-muted) !important;
  border-color: var(--color-chip-active) !important; 
}
.admonition *, .admonition strong, .admonition p, .admonition span, .admonition div, 
.admonition h1, .admonition h2, .admonition h3, .admonition h4, .admonition li,
.admonition a, .admonition code {
  color: var(--color-text) !important; 
}
.admonition .text-white { color: var(--color-text) !important; }

/* Override hardcoded admonition background colors in HTML style tags */
.admonition-info { 
  background: var(--color-surface-muted) !important; 
  background-color: var(--color-surface-muted) !important;
  border-color: var(--color-chip-active) !important; 
}
.admonition-success { 
  background: var(--color-surface-muted) !important; 
  background-color: var(--color-surface-muted) !important;
  border-color: #10b981 !important; 
}
.admonition-warning { 
  background: var(--color-surface-muted) !important; 
  background-color: var(--color-surface-muted) !important;
  border-color: #f59e0b !important; 
}
.admonition-tip { 
  background: var(--color-surface-muted) !important; 
  background-color: var(--color-surface-muted) !important;
  border-color: #6366f1 !important; 
}

/* Dark mode admonitions - Force dark backgrounds and white text */
:root[data-theme="dark"] .admonition {
  background: #1f2937 !important;
  background-color: #1f2937 !important;
  border-color: var(--color-chip-active) !important;
}
:root[data-theme="dark"] .admonition *,
:root[data-theme="dark"] .admonition strong,
:root[data-theme="dark"] .admonition p,
:root[data-theme="dark"] .admonition span,
:root[data-theme="dark"] .admonition div,
:root[data-theme="dark"] .admonition a,
:root[data-theme="dark"] .admonition li {
  color: #ffffff !important;
}
:root[data-theme="dark"] .admonition-info {
  background: #1f2937 !important;
  background-color: #1f2937 !important;
  border-color: #3b82f6 !important;
}
:root[data-theme="dark"] .admonition-success {
  background: #1f2937 !important;
  background-color: #1f2937 !important;
  border-color: #10b981 !important;
}
:root[data-theme="dark"] .admonition-warning {
  background: #1f2937 !important;
  background-color: #1f2937 !important;
  border-color: #f59e0b !important;
}
:root[data-theme="dark"] .admonition-tip {
  background: #1f2937 !important;
  background-color: #1f2937 !important;
  border-color: #6366f1 !important;
}

/* Light mode admonitions - Ensure proper colors */
:root[data-theme="light"] .admonition,
:root:not([data-theme="dark"]) .admonition {
  background: #f5f6fa !important;
  background-color: #f5f6fa !important;
}
:root[data-theme="light"] .admonition *,
:root:not([data-theme="dark"]) .admonition * {
  color: #0f172a !important;
}
:root[data-theme="light"] .admonition-info,
:root:not([data-theme="dark"]) .admonition-info {
  background: #f5f6fa !important;
  background-color: #f5f6fa !important;
}
:root[data-theme="light"] .admonition-success,
:root:not([data-theme="dark"]) .admonition-success {
  background: #f5f6fa !important;
  background-color: #f5f6fa !important;
}
:root[data-theme="light"] .admonition-warning,
:root:not([data-theme="dark"]) .admonition-warning {
  background: #f5f6fa !important;
  background-color: #f5f6fa !important;
}
:root[data-theme="light"] .admonition-tip,
:root:not([data-theme="dark"]) .admonition-tip {
  background: #f5f6fa !important;
  background-color: #f5f6fa !important;
}

/* Theme-aware info boxes with bg-blue-50, bg-yellow-50, bg-green-50 classes */
:root[data-theme="dark"] .bg-blue-50,
:root[data-theme="dark"] .bg-yellow-50,
:root[data-theme="dark"] .bg-green-50 {
  background-color: #1f2937 !important;
  background: #1f2937 !important;
}
:root[data-theme="dark"] .bg-blue-50 *,
:root[data-theme="dark"] .bg-yellow-50 *,
:root[data-theme="dark"] .bg-green-50 * {
  color: #ffffff !important;
}
:root[data-theme="dark"] .text-blue-800,
:root[data-theme="dark"] .text-yellow-800,
:root[data-theme="dark"] .text-green-800 {
  color: #dbeafe !important;
}
:root[data-theme="dark"] .border-blue-400 {
  border-color: #3b82f6 !important;
}
:root[data-theme="dark"] .border-yellow-400 {
  border-color: #fbbf24 !important;
}
:root[data-theme="dark"] .border-green-400 {
  border-color: #34d399 !important;
}

/* Scroll margins and sticky positioning */
main h1, main h2, main h3, main h4 { 
  scroll-margin-top: calc(var(--doc-header-height) + 16px) !important; 
}
aside.sticky { 
  top: 0 !important; 
  height: calc(100vh - var(--doc-header-height)) !important; 
  margin-top: 0 !important;
  padding-top: 0 !important;
  position: sticky !important;
  align-self: flex-start !important;
}
/* Force top-0 to use header height */
aside.sticky.top-0 { 
  top: 0 !important; 
  margin-top: 0 !important;
  padding-top: 0 !important;
  position: sticky !important;
  align-self: flex-start !important;
}
/* Keep support for top-24 for backward compatibility */
aside.sticky.top-24 { 
  top: var(--doc-header-height) !important; 
  margin-top: 0 !important;
  padding-top: 0 !important;
  position: sticky !important;
  align-self: flex-start !important;
}
aside.sticky > div:first-child {
  padding-top: 1.25rem !important;
  margin-top: 0 !important;
}
/* Remove any top margin/padding from sidebar containers */
.flex.flex-col.lg\\:flex-row > aside.sticky {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* Light gray borders instead of dark/black */
hr, .border-gray-200, .border-gray-300, .border-r, .border-l, .border-t, .border-b { 
  border-color: #e5e7eb !important; 
}
:root[data-theme="dark"] hr, 
:root[data-theme="dark"] .border-gray-200, 
:root[data-theme="dark"] .border-gray-300, 
:root[data-theme="dark"] .border-r, 
:root[data-theme="dark"] .border-l, 
:root[data-theme="dark"] .border-t, 
:root[data-theme="dark"] .border-b { 
  border-color: #374151 !important; 
}

/* Mobile menu - white text in dark mode */
#mobile-overlay nav a {
  color: var(--color-text) !important;
}
:root[data-theme="dark"] #mobile-overlay nav a {
  color: #ffffff !important;
}
:root[data-theme="dark"] #mobile-overlay nav a.bg-\\[var\\(--color-sidebar-active\\)\\] {
  color: #ffffff !important;
}

/* Mobile responsive */
@media (max-width: 1024px) {
  aside.sticky { position: static !important; height: auto !important; }
  aside:last-of-type { display: none !important; }
}

/* Theme dropdown styling */
#theme-dropdown, #theme-dropdown-desktop {
  min-width: 140px;
}
.theme-option {
  transition: background-color 0.2s;
}
.theme-check {
  color: #2563eb;
  font-weight: bold;
}
:root[data-theme="dark"] .theme-check {
  color: #60a5fa;
}
/* Ensure dropdown is visible and styled correctly - always light background with dark text */
#theme-dropdown, #theme-dropdown-desktop {
  background: #ffffff !important;
  border: 1px solid #d1d5db !important;
}
/* Dark mode - change to dark background with white text */
:root[data-theme="dark"] #theme-dropdown,
:root[data-theme="dark"] #theme-dropdown-desktop {
  background: #1f2937 !important;
  border: 1px solid #374151 !important;
}
/* Light mode - black text on white background */
#theme-dropdown .theme-option,
#theme-dropdown-desktop .theme-option,
#theme-dropdown .theme-option span,
#theme-dropdown-desktop .theme-option span {
  color: #111827 !important;
}
/* Dark mode - white text on dark background */
:root[data-theme="dark"] #theme-dropdown .theme-option,
:root[data-theme="dark"] #theme-dropdown-desktop .theme-option,
:root[data-theme="dark"] #theme-dropdown .theme-option span,
:root[data-theme="dark"] #theme-dropdown-desktop .theme-option span {
  color: #ffffff !important;
}
/* Hover states */
#theme-dropdown .theme-option:hover,
#theme-dropdown-desktop .theme-option:hover {
  background: #f3f4f6 !important;
}
:root[data-theme="dark"] #theme-dropdown .theme-option:hover,
:root[data-theme="dark"] #theme-dropdown-desktop .theme-option:hover {
  background: #374151 !important;
}
/* Checkmark color */
#theme-dropdown .theme-check,
#theme-dropdown-desktop .theme-check {
  color: #2563eb !important;
}
:root[data-theme="dark"] #theme-dropdown .theme-check,
:root[data-theme="dark"] #theme-dropdown-desktop .theme-check {
  color: #60a5fa !important;
}

/* Code examples component styling */
.lang-tab {
  transition: all 0.2s;
}
#code-examples-topic-document,
#code-examples-document-file,
#code-examples-singleslide,
#code-examples-content-document {
  color: var(--color-text) !important;
}
:root[data-theme="dark"] #code-examples-topic-document,
:root[data-theme="dark"] #code-examples-document-file,
:root[data-theme="dark"] #code-examples-singleslide,
:root[data-theme="dark"] #code-examples-content-document {
  color: #ffffff !important;
}

/* Utilities */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Preserve white text on primary blue buttons/links inside content */
main a.bg-blue-600,
main a.bg-blue-700,
main button.bg-blue-600,
main button.bg-blue-700 {
  color: #ffffff !important;
}
`;
  document.head.appendChild(style);

  function applyTheme(name) {
      const theme = themes[name] || themes.light;
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, val]) => root.style.setProperty(key, val));
      root.dataset.theme = name;
      document.body.style.background = theme["--color-surface"];
      document.body.style.color = theme["--color-text"];

      // Force update text colors for all content elements
      setTimeout(() => {
          const contentElements = document.querySelectorAll("main, section, article, aside, .admonition, table, details, details summary, details > div");
          contentElements.forEach((el) => {
              if (name === "dark") {
                  el.style.color = "#ffffff";
                  if (el.tagName === "SUMMARY" || (el.tagName === "DIV" && el.parentElement?.tagName === "DETAILS")) {
                      el.style.backgroundColor = "#1f2937";
                      el.style.background = "#1f2937";
                  }
              } else {
                  el.style.color = theme["--color-text"];
              }
          });

          // Force update all text elements in dark mode
          if (name === "dark") {
              const allTextElements = document.querySelectorAll("main *, section *, article *, details *, details summary *, details > div *, .admonition *");
              allTextElements.forEach((el) => {
                  if (el.tagName !== "CODE" && el.tagName !== "PRE" && !el.closest("header")) {
                      el.style.color = "#ffffff";
                  }
              });

              // Force update info boxes with bg-blue-50, bg-yellow-50, bg-green-50
              document.querySelectorAll(".bg-blue-50, .bg-yellow-50, .bg-green-50").forEach((el) => {
                  el.style.cssText += "background-color: #1f2937 !important;";
                  el.style.cssText += "background: #1f2937 !important;";
                  el.querySelectorAll("*").forEach((child) => {
                      if (!child.classList.contains("text-blue-300") && !child.classList.contains("text-yellow-300") && !child.classList.contains("text-green-300")) {
                          child.style.cssText += "color: #ffffff !important;";
                      }
                  });
              });

              // Force update admonition backgrounds and text in dark mode
              document.querySelectorAll(".admonition, .admonition-info, .admonition-success, .admonition-warning, .admonition-tip").forEach((el) => {
                  el.style.cssText += "background-color: #1f2937 !important; background: #1f2937 !important;";
                  // Force all child elements to have white text
                  el.querySelectorAll("*").forEach((child) => {
                      if (child.tagName !== "CODE" && child.tagName !== "PRE" && !child.closest("header")) {
                          child.style.cssText += "color: #ffffff !important;";
                          // Override any colored text classes
                          if (
                              child.classList.contains("text-blue-800") ||
                              child.classList.contains("text-blue-900") ||
                              child.classList.contains("text-yellow-800") ||
                              child.classList.contains("text-yellow-900") ||
                              child.classList.contains("text-green-800") ||
                              child.classList.contains("text-green-900") ||
                              child.classList.contains("text-indigo-800") ||
                              child.classList.contains("text-indigo-900")
                          ) {
                              child.style.cssText += "color: #ffffff !important;";
                          }
                      }
                  });
              });
          } else {
              // Light mode - ensure info boxes with bg-blue-50, bg-yellow-50, bg-green-50 have proper light background
              document.querySelectorAll(".bg-blue-50, .bg-yellow-50, .bg-green-50").forEach((el) => {
                  el.style.cssText += "background-color: #dbeafe !important;";
                  el.style.cssText += "background: #dbeafe !important;";
                  el.querySelectorAll("*").forEach((child) => {
                      if (child.classList.contains("text-blue-800") || child.classList.contains("text-blue-900")) {
                          child.style.cssText += "color: #1e40af !important;";
                      } else if (child.classList.contains("text-yellow-800") || child.classList.contains("text-yellow-900")) {
                          child.style.cssText += "color: #92400e !important;";
                      } else if (child.classList.contains("text-green-800") || child.classList.contains("text-green-900")) {
                          child.style.cssText += "color: #065f46 !important;";
                      } else {
                          child.style.cssText += "color: #0f172a !important;";
                      }
                  });
              });

              // Light mode - ensure admonitions have proper light background and dark text
              document.querySelectorAll(".admonition, .admonition-info, .admonition-success, .admonition-warning, .admonition-tip").forEach((el) => {
                  el.style.cssText += "background-color: #f5f6fa !important; background: #f5f6fa !important;";
                  // Force all child elements to have dark text
                  el.querySelectorAll("*").forEach((child) => {
                      if (child.tagName !== "CODE" && child.tagName !== "PRE" && !child.closest("header")) {
                          // Override colored text classes to be readable in light mode
                          if (child.classList.contains("text-blue-800") || child.classList.contains("text-blue-900")) {
                              child.style.cssText += "color: #1e40af !important;";
                          } else if (child.classList.contains("text-yellow-800") || child.classList.contains("text-yellow-900")) {
                              child.style.cssText += "color: #92400e !important;";
                          } else if (child.classList.contains("text-green-800") || child.classList.contains("text-green-900")) {
                              child.style.cssText += "color: #065f46 !important;";
                          } else if (child.classList.contains("text-indigo-800") || child.classList.contains("text-indigo-900")) {
                              child.style.cssText += "color: #3730a3 !important;";
                          } else {
                              child.style.cssText += "color: #0f172a !important;";
                          }
                      }
                  });
              });
          }
      }, 0);
  }

  function getSystemTheme() {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
  }

  function getPreferredTheme() {
      const stored = localStorage.getItem(storageKey);
      if (stored === "system") {
          return getSystemTheme();
      }
      if (stored === "light" || stored === "dark") return stored;
      return getSystemTheme();
  }

  function setTheme(name) {
      localStorage.setItem(storageKey, name);
      if (name === "system") {
          applyTheme(getSystemTheme());
      } else {
          applyTheme(name);
      }
  }

  // Expose API
  window.PaiTheme = {
      set: setTheme,
      current: () => {
          const stored = localStorage.getItem(storageKey);
          if (stored === "system" || !stored) return "system";
          return stored;
      },
      effective: () => document.documentElement.dataset.theme || getPreferredTheme(),
      init: () => {
          const stored = localStorage.getItem(storageKey);
          if (!stored) {
              // Default to system if nothing stored
              localStorage.setItem(storageKey, "system");
          }
          if (stored === "system" || !stored) {
              applyTheme(getSystemTheme());
              // Listen for system theme changes
              const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
              const handleSystemThemeChange = (e) => {
                  if (localStorage.getItem(storageKey) === "system") {
                      applyTheme(e.matches ? "dark" : "light");
                  }
              };
              // Modern browsers
              if (mediaQuery.addEventListener) {
                  mediaQuery.addEventListener("change", handleSystemThemeChange);
              } else {
                  // Fallback for older browsers
                  mediaQuery.addListener(handleSystemThemeChange);
              }
          } else {
              applyTheme(stored);
          }
      },
      toggle: () => {
          const next = window.PaiTheme.current() === "light" ? "dark" : "light";
          setTheme(next);
      },
  };

  // Initialize immediately
  window.PaiTheme.init();
})();
