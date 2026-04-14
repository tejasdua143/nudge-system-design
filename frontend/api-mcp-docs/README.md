# Presentations.AI API Documentation

This repository contains the MkDocs documentation for the Presentations.AI Developer API.

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- pip
- Node.js (for integrated server)

### Setup
```bash
pip install mkdocs-material
```

### Development
```bash

# Option 2: Integrated with Node.js server (recommended)
mkdocs build
cd ..
node index.js
# Access at: http://localhost:7171 (documentation at root /)
```

### Build
```bash
# Build static site
mkdocs build

# Output: ./site/ directory
```

### Deploy
```bash
# Deploy to GitHub Pages
mkdocs gh-deploy
```

## 🔧 Troubleshooting

### Common Issues

**Navigation warning about missing anchor:**
- Check `mkdocs.yml` nav section for broken links
- Remove `#anchor-name` from navigation if header doesn't exist

**CSS not loading:**
- Verify `extra_css` path in `mkdocs.yml`
- Check `docs/stylesheets/extra.css` exists
- Hard refresh browser (Ctrl+F5)

**Footer not visible:**
- Clear browser cache
- Check custom CSS is loading
- Verify `copyright` setting in `mkdocs.yml`

**Build errors:**
```bash
# Clean build
mkdocs build --clean

# Verbose output
mkdocs build --verbose
```

## 📁 Structure

```
api-mcp-docs/
├── mkdocs.yml          # Configuration
├── docs/               # Content
│   ├── index.md       # Home page
│   ├── stylesheets/   # Custom CSS
│   ├── assets/        # Images, icons
│   └── v1/            # API docs
└── docs/              # Documentation source (served by Node.js)
```

## 🌐 Live Site

**Production:** {{ config.extra.main_url }}

## 📝 Editing

- Edit `.md` files in `docs/` folder
- Use Material Design components and admonitions
- Test locally with `mkdocs serve` before pushing
- After editing, run `mkdocs build` to update integrated site

## 🔗 Integration Features

### Node.js Integration
- Documentation served at root path (`/`) by Node.js server
- Login button in header routes to `/docs/login`
- Consistent branding across documentation and application pages
- Automatic rebuild and deploy via GitHub Actions

### Authentication Flow
1. **Public Access**: Documentation accessible without login
2. **Login Button**: Top-right corner routes to Node.js authentication
3. **Consistent Design**: All pages use Presentations.AI brand colors (`#0043ce`)

### File Structure
```
api-mcp/
├── index.js                # Main entry point
├── src/                    # Node.js application
│   ├── server.js          # Serves docs at root + handles auth
│   └── views/             # Login, error, developer pages
├── api-mcp-docs/
│   └── docs/              # Documentation source (served by Node.js)
```