(function () {
    // Function to get dynamic login URL based on current server
    function getLoginUrl() {
        const hostname = window.location.hostname;
        if (hostname.includes('dev-apis') || hostname.includes('devmcp')) {
            return 'https://dev-apis.presentations.ai/docs/login';
        } else if (hostname.includes('developers')) {
            return 'https://developers.presentations.ai/docs/login';
        } else {
            // Fallback to current origin
            return window.location.origin + '/docs/login';
        }
    }

    function computeActive(pathname) {
        if (pathname.includes("index.html") || pathname === "/") return "overview";
        return "api";
    }

    function updateHeaderActive() {
        const active = computeActive(window.location.pathname);
        const overviewLink = document.querySelector('nav a[href$="index.html"]');
        const apiLink = document.querySelector('nav a[href$="quickstart.html"]');
        if (!overviewLink || !apiLink) return;

        const baseClass =
            "px-3 py-1.5 rounded-md text-white hover:bg-[var(--color-chip-hover)] text-sm font-medium flex items-center space-x-1.5";
        const activeClass =
            "px-3 py-1.5 rounded-md text-white chip-active-gradient text-sm font-medium flex items-center space-x-1.5";

        overviewLink.className = active === "overview" ? activeClass : baseClass;
        apiLink.className = active === "api" ? activeClass : baseClass;
    }

    function renderHeader(prefix = "") {
        const loginUrl = getLoginUrl();
        let menuOpen = false;
        let searchData = null;
        let searchConfig = null;
        let modalOpen = false;
        const active = computeActive(window.location.pathname);
        const overviewClass =
            active === "overview"
                ? "px-3 py-1.5 rounded-md text-white chip-active-gradient text-sm font-medium flex items-center space-x-1.5"
                : "px-3 py-1.5 rounded-md text-white hover:bg-[var(--color-chip-hover)] text-sm font-medium flex items-center space-x-1.5";
        const apiClass =
            active === "api"
                ? "px-3 py-1.5 rounded-md text-white chip-active-gradient text-sm font-medium flex items-center space-x-1.5"
                : "px-3 py-1.5 rounded-md text-white hover:bg-[var(--color-chip-hover)] text-sm font-medium flex items-center space-x-1.5";

        const header = document.getElementById("site-header");
        if (!header) return;

        header.innerHTML = `
      <header class="sticky top-0 z-50 shadow-sm border-b" style="background: var(--color-header-bg); border-color: var(--color-header-border); color: #ffffff;">
        <div class="max-w-full xl:max-w-full mx-auto px-4 md:px-6">
          <!-- Mobile Header: Compact single row -->
          <div class="md:hidden flex items-center justify-between py-2.5 gap-2">
            <div class="flex items-center space-x-2 flex-1 min-w-0">
              <button id="mobile-menu-toggle" class="text-white hover:opacity-80 p-1.5" title="Menu">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <a class="flex items-center space-x-2 min-w-0" href="${prefix}index.html">
                <img id="mobile-logo" src="${prefix}assets/presentations_ai_white.svg" alt="Presentations.AI" class="h-8 flex-shrink-0" style="max-width: 180px;">
              </a>
            </div>
            <div class="flex items-center space-x-1.5 flex-shrink-0">
              <button id="toc-open" class="text-white hover:opacity-80 px-2.5 py-1.5 text-xs border border-white/20 rounded">
                Contents
              </button>
              <button id="search-open-mobile" class="text-white hover:opacity-80 p-1.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
              <a href="${loginUrl}" class="text-xs px-2.5 py-1.5" style="color:#ffffff !important;">Login</a>
              <div class="relative">
                <button id="theme-dropdown-toggle" type="button" class="text-white hover:opacity-80 p-1.5 min-w-[2rem] min-h-[2rem] inline-flex items-center justify-center" title="Theme" aria-label="Toggle theme">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </button>
                <div id="theme-dropdown" class="hidden absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-xl z-[9999] py-1" style="background: #ffffff !important; border-color: #d1d5db !important;">
                  <button data-theme="system" class="theme-option w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 flex items-center justify-between transition-colors" style="color: #111827 !important;">
                    <span style="color: #111827 !important;">System</span>
                    <span class="theme-check text-blue-600 font-bold hidden" style="color: #2563eb !important;">✓</span>
                  </button>
                  <button data-theme="light" class="theme-option w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 flex items-center justify-between transition-colors" style="color: #111827 !important;">
                    <span style="color: #111827 !important;">Light</span>
                    <span class="theme-check text-blue-600 font-bold hidden" style="color: #2563eb !important;">✓</span>
                  </button>
                  <button data-theme="dark" class="theme-option w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 flex items-center justify-between transition-colors" style="color: #111827 !important;">
                    <span style="color: #111827 !important;">Dark</span>
                    <span class="theme-check text-blue-600 font-bold hidden" style="color: #2563eb !important;">✓</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Desktop Header: Two rows -->
          <div class="hidden md:block py-2 space-y-2">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center space-x-3">
                <a class="flex items-center space-x-3" href="${prefix}index.html">
                  <img id="desktop-logo" src="${prefix}assets/presentations_ai_white.svg" alt="Presentations.AI" class="h-8" style="max-width: 180px;">
                </a>
              </div>
              <div class="flex items-center space-x-2 md:space-x-3">
                <a href="${loginUrl}" class="text-sm" style="color:#ffffff !important;">Login</a>
                <div class="relative">
                  <button id="theme-dropdown-toggle-desktop" type="button" class="text-white hover:opacity-80 p-2.5 min-w-[2.25rem] min-h-[2.25rem] border border-[var(--color-header-control-border)] rounded inline-flex items-center justify-center hover:border-[var(--color-header-control-border-hover)]" title="Theme" aria-label="Toggle theme">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </button>
                  <div id="theme-dropdown-desktop" class="hidden absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-xl z-[9999] py-1" style="background: #ffffff !important; border-color: #d1d5db !important;">
                    <button data-theme="system" class="theme-option w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 flex items-center justify-between transition-colors" style="color: #111827 !important;">
                      <span style="color: #111827 !important;">System</span>
                      <span class="theme-check text-blue-600 font-bold hidden" style="color: #2563eb !important;">✓</span>
                    </button>
                    <button data-theme="light" class="theme-option w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 flex items-center justify-between transition-colors" style="color: #111827 !important;">
                      <span style="color: #111827 !important;">Light</span>
                      <span class="theme-check text-blue-600 font-bold hidden" style="color: #2563eb !important;">✓</span>
                    </button>
                    <button data-theme="dark" class="theme-option w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-100 flex items-center justify-between transition-colors" style="color: #111827 !important;">
                      <span style="color: #111827 !important;">Dark</span>
                      <span class="theme-check text-blue-600 font-bold hidden" style="color: #2563eb !important;">✓</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
              <nav class="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                <a href="${prefix}index.html" class="${overviewClass}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <span>Overview</span>
                </a>
                <a href="${prefix}quickstart.html" class="${apiClass}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                  <span>API Reference</span>
                </a>
              </nav>

              <div class="flex items-center space-x-2 md:space-x-3">
                <button id="search-open" class="relative bg-[rgba(15,23,42,0.35)] border border-[var(--color-header-control-border)] text-white px-3 py-1.5 rounded text-sm w-32 md:w-44 flex items-center gap-2 justify-between hover:border-[var(--color-header-control-border-hover)]">
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <svg class="w-4 h-4 text-white/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <span class="text-white opacity-80 text-xs md:text-sm truncate">Search</span>
                  </div>
                  <span class="text-gray-300 text-xs hidden md:inline flex-shrink-0">⌘K</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;

        // Wire theme dropdown for mobile and desktop
        function setupThemeDropdown(toggleId, dropdownId) {
            const toggle = document.getElementById(toggleId);
            const dropdown = document.getElementById(dropdownId);
            if (!toggle || !dropdown || !window.PaiTheme) return;

            function updateCheckmarks() {
                const currentTheme = window.PaiTheme.current();
                dropdown.querySelectorAll(".theme-option").forEach((option) => {
                    const check = option.querySelector(".theme-check");
                    if (option.getAttribute("data-theme") === currentTheme) {
                        check.classList.remove("hidden");
                    } else {
                        check.classList.add("hidden");
                    }
                });
            }

            // Update checkmarks when theme changes
            const observer = new MutationObserver(() => {
                updateCheckmarks();
            });
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["data-theme"],
            });

            toggle.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.toggle("hidden");
                updateCheckmarks();
            });

            dropdown.querySelectorAll(".theme-option").forEach((option) => {
                option.addEventListener("click", (e) => {
                    e.preventDefault();
                    const theme = option.getAttribute("data-theme");
                    window.PaiTheme.set(theme);
                    dropdown.classList.add("hidden");
                    updateCheckmarks();
                });
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", (e) => {
                if (!dropdown.contains(e.target) && e.target !== toggle) {
                    dropdown.classList.add("hidden");
                }
            });

            // Initial checkmark update
            setTimeout(updateCheckmarks, 100);

            // Also update when theme actually changes
            if (window.PaiTheme) {
                const originalSet = window.PaiTheme.set;
                window.PaiTheme.set = function (theme) {
                    originalSet.call(this, theme);
                    setTimeout(updateCheckmarks, 50);
                };
            }
        }

        setupThemeDropdown("theme-dropdown-toggle", "theme-dropdown");
        setupThemeDropdown("theme-dropdown-toggle-desktop", "theme-dropdown-desktop");

        const menuToggle = document.getElementById("mobile-menu-toggle");
        if (menuToggle) {
            let mobileOverlay = document.getElementById("mobile-overlay");
            if (!mobileOverlay) {
                mobileOverlay = document.createElement("div");
                mobileOverlay.id = "mobile-overlay";
                mobileOverlay.className = "hidden fixed inset-0 z-[1200]";
                document.body.appendChild(mobileOverlay);
            }

            function buildMobileMenu() {
                const leftSidebar = document.querySelector("aside:first-of-type nav");
                const rightToc = document.querySelector("aside:last-of-type nav");
                let sidebarLinks = "";
                let tocLinks = "";

                // Check if dark mode
                const isDarkMode = document.documentElement.dataset.theme === "dark";
                const menuTextColor = isDarkMode ? "text-white" : "text-[var(--color-text)]";

                if (leftSidebar) {
                    const links = leftSidebar.querySelectorAll("a");
                    links.forEach((link) => {
                        const href = link.getAttribute("href");
                        const text = link.textContent.trim();
                        const isActive = link.classList.contains("bg-light-accent") || link.classList.contains("font-medium");
                        const activeClass = isActive ? "bg-[var(--color-sidebar-active)] font-medium" : "";
                        sidebarLinks += `<a href="${href}" class="block px-3 py-2 rounded-md ${menuTextColor} hover:bg-[var(--color-sidebar-active)] text-sm ${activeClass}">${text}</a>`;
                    });
                } else {
                    sidebarLinks = `
                      <a href="${prefix}index.html" class="block px-3 py-2 rounded-md ${menuTextColor} hover:bg-[var(--color-sidebar-active)] text-sm">Introduction to Presentations.AI API offerings</a>
                      <a href="${prefix}quickstart.html" class="block px-3 py-2 rounded-md ${menuTextColor} hover:bg-[var(--color-sidebar-active)] text-sm">Quick Start Guide</a>
                      <a href="${prefix}register/register.html" class="block px-3 py-2 rounded-md ${menuTextColor} hover:bg-[var(--color-sidebar-active)] text-sm">Account Registration</a>
                      <a href="${prefix}v1/topic-document.html" class="block px-3 py-2 rounded-md ${menuTextColor} hover:bg-[var(--color-sidebar-active)] text-sm">Create from Topic</a>
                      <a href="${prefix}v1/document-file.html" class="block px-3 py-2 rounded-md ${menuTextColor} hover:bg-[var(--color-sidebar-active)] text-sm">Create from File</a>
                      <a href="${prefix}v1/topic-singleslide.html" class="block px-3 py-2 rounded-md ${menuTextColor} hover:bg-[var(--color-sidebar-active)] text-sm">Create Single Slide</a>
                      <a href="${prefix}mcp-v1/create-document-from-content.html" class="block px-3 py-2 rounded-md ${menuTextColor} hover:bg-[var(--color-sidebar-active)] text-sm">MCP Integration</a>
                    `;
                }

                // TOC removed from mobile menu as per user request

                mobileOverlay.innerHTML = `
                  <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                  <div class="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-[var(--color-surface)] text-[var(--color-text)] shadow-2xl flex flex-col overflow-hidden">
                    <div class="flex items-center justify-between px-5 py-4 border-b border-[var(--color-header-border)] bg-[var(--color-surface-muted)]">
                      <span class="text-lg font-bold text-[var(--color-text)]">Menu</span>
                      <button id="mobile-menu-close" class="p-2 text-[var(--color-text)] hover:bg-[var(--color-sidebar-active)] rounded-md transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                      ${sidebarLinks}
                    </nav>
                    <div class="px-5 py-4 border-t border-[var(--color-header-border)] bg-[var(--color-surface-muted)] space-y-3">
                      <button id="search-open-mobile" class="w-full bg-[var(--color-surface)] border border-[var(--color-header-border)] text-[var(--color-text)] px-4 py-3 rounded-lg text-sm flex items-center gap-3 hover:border-[var(--color-chip-active)] transition-all shadow-sm hover:shadow-md">
                        <svg class="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <span class="flex-1 text-left text-[var(--color-text)]">Search</span>
                        <span class="text-[var(--color-text-muted)] text-xs bg-[var(--color-surface-muted)] px-2 py-0.5 rounded">⌘K</span>
                      </button>
                      <a href="${loginUrl}" class="block text-center text-sm py-2.5 px-3 rounded-lg font-medium" style="background:#FF5500 !important;color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;">Login</a>
                    </div>
                  </div>
                `;
            }

            const mobileClose = mobileOverlay.querySelector("#mobile-menu-close");
            const mobileLinks = mobileOverlay.querySelectorAll("a, button");

            function toggleMobile(open) {
                if (open) buildMobileMenu();
                mobileOverlay.classList.toggle("hidden", !open);
                menuOpen = open;
            }

            menuToggle.addEventListener("click", () => toggleMobile(!menuOpen));
            mobileOverlay.addEventListener("click", (e) => {
                if (e.target === mobileOverlay.firstElementChild) toggleMobile(false);
            });
            const closeHandler = () => toggleMobile(false);
            mobileOverlay.addEventListener("click", (e) => {
                if (e.target.id === "mobile-menu-close" || e.target.closest("#mobile-menu-close")) closeHandler();
            });
            mobileOverlay.addEventListener("click", (e) => {
                const link = e.target.closest("a");
                if (link && link.href) {
                    closeHandler();
                }
                if (e.target.id === "search-open-mobile" || e.target.closest("#search-open-mobile")) {
                    closeHandler();
                    setTimeout(() => document.getElementById("search-open")?.click(), 100);
                }
            });
        }

        function resolveLocation(loc) {
            if (!loc || loc === "") return `${prefix}index.html`;
            if (loc.startsWith("#")) return `${prefix}index.html${loc}`;

            let hash = "";
            let path = loc;
            if (loc.includes("#")) {
                [path, hash] = loc.split("#");
                hash = `#${hash}`;
            }

            // remove trailing slash
            if (path.endsWith("/")) path = path.slice(0, -1);

            // if no extension, assume .html
            if (!/\.[a-zA-Z0-9]+$/.test(path)) {
                path = path === "" ? "index.html" : `${path}.html`;
            }

            return `${prefix}${path}${hash}`;
        }

        // Helper function to strip HTML and create snippet
        function createSnippet(html, maxLength = 120) {
            if (!html) return "";
            // Create a temporary div to parse HTML
            const div = document.createElement("div");
            div.innerHTML = html;
            // Get text content and clean it up
            let text = div.textContent || div.innerText || "";
            // Remove extra whitespace
            text = text.replace(/\s+/g, " ").trim();
            // Truncate if needed
            if (text.length > maxLength) {
                text = text.substring(0, maxLength).trim() + "...";
            }
            return text;
        }

        function renderResults(results, container) {
            if (!container) return;
            if (!results.length) {
                container.innerHTML = '<div class="px-3 py-2 text-sm text-[var(--color-text-muted)]">No matches</div>';
                container.classList.remove("hidden");
                return;
            }
            container.innerHTML = results
                .slice(0, 8)
                .map((r) => {
                    const snippet = createSnippet(r.text, 100);
                    return `
                <button data-target="${resolveLocation(r.location)}" class="w-full text-left px-3 py-2 hover:bg-[var(--color-sidebar-active)]">
                    <div class="text-sm font-medium">${r.title || "Untitled"}</div>
                    ${snippet ? `<div class="text-xs text-[var(--color-text-muted)] truncate mt-0.5">${snippet}</div>` : ""}
                </button>`;
                })
                .join("");
            container.classList.remove("hidden");
        }

        // Load search index once, with robust fallbacks for different hosting paths
        async function loadSearchIndex(prefix) {
            if (searchData && searchConfig) return { docs: searchData, config: searchConfig };

            const pathName = window.location.pathname || "/";
            // Try to detect a "/docs" prefix in the deployed path (e.g. /docs/quickstart.html)
            const docsMatch = pathName.match(/^(.*\/docs)\//);
            const docsRoot = docsMatch ? `${docsMatch[1]}/` : "";

            // Support both local "site/" output and plain "search/" at docs root or current prefix
            const candidateUrls = [
                // New location in docs/search
                `${prefix}search/search_index.json`,
                // Local dev build under /site
                `${prefix}site/search/search_index.json`,
                `${prefix}site/search_index.json`,
                `/site/search/search_index.json`,
                `/site/search_index.json`,
                // Deployed MkDocs default under /search
                `/search/search_index.json`,
                docsRoot ? `${docsRoot}search/search_index.json` : null,
                docsRoot ? `${docsRoot}site/search/search_index.json` : null,
                docsRoot ? `${docsRoot}site/search_index.json` : null,
            ].filter(Boolean);

            for (const url of candidateUrls) {
                try {
                    const res = await fetch(url, { credentials: "same-origin" });
                    if (!res.ok) continue;

                    // Try to parse as JSON even if content-type is not ideal.
                    const text = await res.text();
                    let json;
                    try {
                        json = JSON.parse(text);
                    } catch {
                        // Not valid JSON, try next candidate
                        continue;
                    }

                    const docs = json.docs || [];
                    const config = json.config || {};
                    if (Array.isArray(docs) && docs.length) {
                        searchData = docs;
                        searchConfig = config;
                        return { docs: searchData, config: searchConfig };
                    }
                } catch (err) {
                    // Try next candidate
                    continue;
                }
            }

            console.error("Search index load failed: no valid JSON found for", candidateUrls);
            searchData = [];
            searchConfig = {};
            return { docs: searchData, config: searchConfig };
        }

        // Improved search function with MkDocs-style scoring
        function searchDocs(query, docs, config) {
            if (!query || query.length < 2) return [];

            // Tokenize query - split by whitespace, hyphens, and other word separators
            // MkDocs separator pattern is typically "[\\s\\-]+" which means whitespace and hyphens
            // We'll use a simple approach: split on whitespace and hyphens
            const queryTerms = query
                .toLowerCase()
                .split(/[\s\-_]+/) // Split on whitespace, hyphens, and underscores
                .filter((term) => term.length > 0);
            if (queryTerms.length === 0) return [];

            // Get boost values from config
            const titleBoost = config?.fields?.title?.boost || 1000.0;
            const textBoost = config?.fields?.text?.boost || 1.0;
            const tagsBoost = config?.fields?.tags?.boost || 1000000.0;

            // Score each document
            const scoredDocs = docs.map((doc) => {
                let score = 0;
                const title = (doc.title || "").toLowerCase();
                const text = (doc.text || "").toLowerCase();
                const tags = (doc.tags || []).map((t) => t.toLowerCase());

                // Check each query term
                queryTerms.forEach((term) => {
                    // Title matches (highest priority)
                    if (title.includes(term)) {
                        // Exact match gets higher score
                        if (title === term) {
                            score += titleBoost * 2;
                        } else if (title.startsWith(term)) {
                            score += titleBoost * 1.5;
                        } else {
                            score += titleBoost;
                        }
                    }

                    // Text matches
                    if (text.includes(term)) {
                        // Count occurrences
                        const occurrences = (text.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
                        score += textBoost * Math.min(occurrences, 5); // Cap at 5 occurrences
                    }

                    // Tags matches (if available)
                    tags.forEach((tag) => {
                        if (tag.includes(term)) {
                            score += tagsBoost;
                        }
                    });
                });

                return { doc, score };
            });

            // Filter out zero-score results and sort by score
            return scoredDocs
                .filter((item) => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map((item) => item.doc);
        }

        function attachSearch(inputId, resultsId) {
            const input = document.getElementById(inputId);
            const results = document.getElementById(resultsId);
            if (!input || !results) return;

            input.addEventListener("input", async (e) => {
                const q = e.target.value.trim();
                if (!q || q.length < 2) {
                    results.classList.add("hidden");
                    return;
                }

                const { docs, config } = await loadSearchIndex(prefix);
                if (!Array.isArray(docs) || !docs.length) {
                    renderResults([], results);
                    return;
                }

                const matches = searchDocs(q, docs, config);
                renderResults(matches, results);
            });

            results.addEventListener("click", (e) => {
                const target = e.target.closest("button[data-target]");
                if (target) {
                    const href = target.getAttribute("data-target");
                    results.classList.add("hidden"); // Hide results before navigation
                    if (window.__docsSpaLoad) {
                        window.__docsSpaLoad(href, { push: true });
                    } else {
                        window.location.href = href;
                    }
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !results.classList.contains("hidden")) {
                    const first = results.querySelector("button[data-target]");
                    if (first) {
                        const href = first.getAttribute("data-target");
                        if (window.__docsSpaLoad) {
                            window.__docsSpaLoad(href, { push: true });
                        } else {
                            window.location.href = href;
                        }
                    }
                }
            });

            input.addEventListener("focus", () => {
                if (results.children.length > 0) results.classList.remove("hidden");
            });
            input.addEventListener("blur", () => {
                setTimeout(() => results.classList.add("hidden"), 150);
            });
        }

        attachSearch("doc-search", "doc-search-results");
        attachSearch("doc-search-mobile", "doc-search-results-mobile");

        // Modal search UI
        async function ensureSearchData() {
            const { docs, config } = await loadSearchIndex(prefix);
            return { docs, config };
        }

        function createModal() {
            if (document.getElementById("search-modal")) return;
            const modal = document.createElement("div");
            modal.id = "search-modal";
            modal.className = "hidden fixed inset-0 z-[999]";
            modal.innerHTML = `
              <div class="absolute inset-0 bg-black/40"></div>
              <div class="relative max-w-4xl mx-auto mt-16 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-header-border)] rounded-xl shadow-2xl">
                <div class="flex items-center px-4 py-3 border-b border-[var(--color-header-border)]">
                  <input id="search-input-modal" type="text" placeholder="Search..." class="flex-1 bg-transparent outline-none text-base">
                  <button id="search-close" class="ml-3 text-sm text-[var(--color-text-muted)]">Esc</button>
                </div>
                <div id="search-results-modal" class="max-h-[60vh] overflow-auto p-3 space-y-1">
                  <div class="text-sm text-[var(--color-text-muted)]">Start typing to search…</div>
                </div>
              </div>
            `;
            document.body.appendChild(modal);
        }

        function renderModalResults(query, results) {
            const container = document.getElementById("search-results-modal");
            if (!container) return;
            if (!query) {
                container.innerHTML = '<div class="text-sm text-[var(--color-text-muted)]">Start typing to search…</div>';
                return;
            }
            if (!results.length) {
                container.innerHTML = '<div class="text-sm text-[var(--color-text-muted)]">No matches</div>';
                return;
            }
            container.innerHTML = results
                .slice(0, 20)
                .map((r) => {
                    const snippet = createSnippet(r.text, 150);
                    return `
                  <button data-target="${resolveLocation(r.location)}" class="w-full text-left px-3 py-2 hover:bg-[var(--color-sidebar-active)] rounded">
                    <div class="text-sm font-medium">${r.title || "Untitled"}</div>
                    ${snippet ? `<div class="text-xs text-[var(--color-text-muted)] truncate mt-0.5">${snippet}</div>` : ""}
                  </button>`;
                })
                .join("");
        }

        function wireModal() {
            const modal = document.getElementById("search-modal");
            const input = document.getElementById("search-input-modal");
            const closeBtn = document.getElementById("search-close");
            if (!modal || !input) return;

            function closeModal() {
                modal.classList.add("hidden");
                modalOpen = false;
            }

            function openModal() {
                modal.classList.remove("hidden");
                modalOpen = true;
                input.value = "";
                renderModalResults("", []);
                input.focus();
            }

            input.addEventListener("input", async (e) => {
                const q = e.target.value.trim();
                if (!q || q.length < 2) {
                    renderModalResults("", []);
                    return;
                }
                const { docs, config } = await ensureSearchData();
                const matches = searchDocs(q, docs, config);
                renderModalResults(q, matches);
            });

            modal.addEventListener("click", (e) => {
                if (e.target.id === "search-modal" || e.target === modal.firstElementChild) {
                    closeModal();
                }
                const btn = e.target.closest("button[data-target]");
                if (btn) {
                    const target = btn.getAttribute("data-target");
                    closeModal(); // Close modal before navigation
                    if (window.__docsSpaLoad) {
                        window.__docsSpaLoad(target, { push: true });
                    } else {
                        window.location.href = target;
                    }
                }
            });

            closeBtn?.addEventListener("click", closeModal);
            document.addEventListener("keydown", (e) => {
                if (modalOpen && e.key === "Escape") {
                    closeModal();
                }
                if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                    e.preventDefault();
                    openModal();
                }
            });

            const triggers = [document.getElementById("search-open"), document.getElementById("search-open-mobile")];
            triggers.forEach((t) => t?.addEventListener("click", openModal));
        }

        createModal();
        wireModal();

        // TOC modal (mobile/desktop)
        (function wireToc() {
            const trigger = document.getElementById("toc-open");
            if (!trigger) return;
            let modal = document.getElementById("toc-modal");
            if (!modal) {
                modal = document.createElement("div");
                modal.id = "toc-modal";
                modal.className = "hidden fixed inset-0 z-[1100]";
                modal.innerHTML = `
                  <div class="absolute inset-0 bg-black/40"></div>
                  <div class="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-header-border)] rounded-xl shadow-2xl">
                    <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--color-header-border)]">
                      <span class="text-base font-semibold">Contents</span>
                      <button id="toc-close" class="p-2 text-[var(--color-text)] hover:opacity-80">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div id="toc-list" class="p-3 space-y-2 max-h-[60vh] overflow-auto text-sm"></div>
                  </div>
                `;
                document.body.appendChild(modal);
            }
            const overlay = modal.firstElementChild;
            const list = modal.querySelector("#toc-list");
            const closeBtn = modal.querySelector("#toc-close");

            function slugify(text) {
                return text
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
            }

            function buildToc() {
                list.innerHTML = "";
                const seen = {};
                const headings = Array.from(document.querySelectorAll("main h2, main h3"));
                headings.forEach((h) => {
                    const base = slugify(h.textContent || "section");
                    const count = seen[base] || 0;
                    const id = count === 0 ? base : `${base}-${count}`;
                    seen[base] = count + 1;
                    if (!h.id) h.id = id;
                    const level = h.tagName.toLowerCase() === "h3" ? "pl-4" : "";
                    const btn = document.createElement("button");
                    btn.className = `block w-full text-left px-3 py-2 rounded hover:bg-[var(--color-sidebar-active)] ${level}`;
                    btn.textContent = h.textContent.trim();
                    btn.addEventListener("click", () => {
                        const target = document.getElementById(h.id);
                        if (target) {
                            const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--doc-header-height")) || 104;
                            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = targetPosition - headerHeight - 16;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth",
                            });
                            modal.classList.add("hidden");
                            history.replaceState(null, "", `#${h.id}`);
                        }
                    });
                    list.appendChild(btn);
                });
                if (!list.children.length) {
                    list.innerHTML = '<div class="text-[var(--color-text-muted)]">No sections</div>';
                }
            }

            function open() {
                buildToc();
                modal.classList.remove("hidden");
            }
            function close() {
                modal.classList.add("hidden");
            }

            trigger.addEventListener("click", open);
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) close();
            });
            closeBtn?.addEventListener("click", close);
        })();

        // Sync table of contents links on desktop and enable smooth scrolling
        (function syncTocLinks() {
            function slugify(text) {
                return text
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
            }

            function assignHeadingIds() {
                const seen = {};
                const headerHeight = getComputedStyle(document.documentElement).getPropertyValue("--doc-header-height") || "104px";
                document.querySelectorAll("main h1, main h2, main h3, main h4").forEach((h) => {
                    const base = slugify(h.textContent || "section");
                    const count = seen[base] || 0;
                    const id = count === 0 ? base : `${base}-${count}`;
                    seen[base] = count + 1;
                    if (!h.id) h.id = id;
                    // Use CSS variable for scroll margin
                    h.style.scrollMarginTop = `calc(${headerHeight} + 16px)`;
                });
                return seen;
            }

            function wireLinks() {
                document.querySelectorAll("aside nav a[href^='#']").forEach((link) => {
                    link.addEventListener("click", (e) => {
                        const hash = link.getAttribute("href");
                        if (!hash) return;
                        const targetId = hash.replace("#", "");
                        const target = document.getElementById(targetId);
                        if (target) {
                            e.preventDefault();
                            // Get header height for proper offset
                            const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--doc-header-height")) || 104;
                            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = targetPosition - headerHeight - 16;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth",
                            });
                            history.replaceState(null, "", hash);
                        }
                    });
                });
            }

            const ready = () => {
                assignHeadingIds();
                // If TOC items lack matching IDs, adjust their href to match heading IDs
                document.querySelectorAll("aside nav a[href^='#']").forEach((link) => {
                    const text = link.textContent || "";
                    const slug = slugify(text);
                    const target = document.getElementById(slug);
                    if (target) link.setAttribute("href", `#${target.id}`);
                });
                wireLinks();
            };

            if (document.readyState === "complete" || document.readyState === "interactive") {
                setTimeout(ready, 0);
            } else {
                document.addEventListener("DOMContentLoaded", ready);
            }
        })();

        // Ensure active tab state is correct after initial render
        updateHeaderActive();
    }

    window.renderHeader = renderHeader;

    // SPA-style navigation for docs: smooth loader + content swap
    (function setupDocsSpaNavigation() {
        // Enable SPA navigation for smooth tab changes (no full page reloads).
        // We keep the header static and only swap the main docs shell.
        const enableSpaNavigation = true;
        if (!enableSpaNavigation || !window.history || !window.fetch || !window.DOMParser) return;

        // Simple top progress bar (no page fade)
        // Progress indicator is disabled to avoid any visual flicker in the header area.
        function getProgressBar() {
            return null;
        }

        function startProgress() {
            // no-op
        }

        function finishProgress() {
            // no-op
        }

        function isSameOriginNavigableLink(a) {
            if (!a || !a.getAttribute) return false;
            const href = a.getAttribute("href");
            if (!href) return false;

            // Ignore in-page anchors and special schemes
            if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
                return false;
            }

            // External absolute URLs
            try {
                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) return false;
            } catch {
                return false;
            }

            // Only handle HTML/doc links (no files like .png, .json, etc.)
            const lower = href.toLowerCase();
            if (lower.match(/\.(png|jpe?g|gif|svg|ico|pdf|json|js|css|woff2?|ttf|eot)(\?|#|$)/)) {
                return false;
            }

            return true;
        }

        function executePageInlineScripts(doc) {
            const scripts = Array.from(doc.querySelectorAll("script")).filter((s) => !s.src);

            scripts.forEach((orig) => {
                const code = (orig.textContent || "").trim();
                if (!code) return;

                // Skip the bootstrap script that loads theme.js/header.js
                if (code.includes("assets/theme.js") && code.includes("assets/header.js")) {
                    return;
                }

                const s = document.createElement("script");
                if (orig.type) s.type = orig.type;
                s.textContent = code;
                document.body.appendChild(s);
            });
        }

        async function loadDoc(url, options = { push: true }) {
            const targetUrl = new URL(url, window.location.href);

            // If it's the same page with a hash, just smooth-scroll to the section
            if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
                const id = targetUrl.hash.replace("#", "");
                const target = document.getElementById(id);
                if (target) {
                    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--doc-header-height")) || 104;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight - 16;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                    if (options.push !== false) {
                        window.history.pushState({}, "", targetUrl.pathname + targetUrl.search + targetUrl.hash);
                    } else {
                        window.history.replaceState({}, "", targetUrl.pathname + targetUrl.search + targetUrl.hash);
                    }
                }
                return;
            }

            startProgress();

            try {
                const res = await fetch(targetUrl.href, { credentials: "same-origin" });
                if (!res.ok) {
                    // Fallback to full navigation
                    window.location.href = targetUrl.href;
                    return;
                }
                const text = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");

                const newShell = doc.querySelector("body > div.flex.flex-col.lg\\:flex-row") || doc.querySelector("div.flex.flex-col.lg\\:flex-row");
                const currentShell = document.querySelector("body > div.flex.flex-col.lg\\:flex-row") || document.querySelector("div.flex.flex-col.lg\\:flex-row");

                if (!newShell || !currentShell) {
                    window.location.href = targetUrl.href;
                    return;
                }

                const newTitleEl = doc.querySelector("title");
                if (newTitleEl) {
                    document.title = newTitleEl.textContent;
                }

                // Replace main+sidebars shell
                currentShell.replaceWith(newShell);

                // Run any page-specific inline scripts (tabs, etc.)
                executePageInlineScripts(doc);

                if (options.push) {
                    window.history.pushState({}, "", targetUrl.pathname + targetUrl.search + targetUrl.hash);
                }

                finishProgress();

                // Re-sync desktop TOC links for new content and update header active state
                if (typeof updateHeaderActive === "function") {
                    updateHeaderActive();
                }
            } catch (e) {
                console.error("SPA navigation failed, falling back:", e);
                window.location.href = targetUrl.href;
            }
        }

        // Expose loader for other components (search, etc.)
        window.__docsSpaLoad = loadDoc;

        // Intercept left sidebar and header doc links
        document.addEventListener("click", (event) => {
            const a = event.target.closest && event.target.closest("a[href]");
            if (!a) return;

            // Modifier clicks / new tabs -> allow default
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || a.target === "_blank") {
                return;
            }

            if (!isSameOriginNavigableLink(a)) {
                return;
            }

            // Only handle navigation within docs (relative links, .html files)
            event.preventDefault();
            loadDoc(a.href, { push: true });
        });

        // Handle back/forward buttons
        window.addEventListener("popstate", () => {
            loadDoc(window.location.href, { push: false });
        });
    })();
})();
