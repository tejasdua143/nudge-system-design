#!/usr/bin/env python3
"""
Script to update all HTML files with:
1. Two-row header structure matching Gamma's design
2. Remove all "gamma" references from class names
3. Update Tailwind config colors
4. Update sidebar sticky positioning
"""

import os
import re
from pathlib import Path

# Color mappings
COLOR_REPLACEMENTS = {
    'gamma-blue': 'primary-blue',
    'gamma-purple': 'accent-blue',
    'gamma-light-purple': 'light-accent',
    'bg-gamma-blue': 'bg-primary-blue',
    'bg-gamma-purple': 'bg-accent-blue',
    'bg-gamma-light-purple': 'bg-light-accent',
}

# Header structure templates for different path depths
HEADER_TEMPLATES = {
    0: {  # Root level (mainpages/)
        'logo_path': '../assets/presentations_ai_white.svg',
        'overview_path': 'index.html',
        'api_ref_path': '../quickstart.html',
    },
    1: {  # One level deep (docs/)
        'logo_path': 'assets/presentations_ai_white.svg',
        'overview_path': 'mainpages/index.html',
        'api_ref_path': 'quickstart.html',
    },
    2: {  # Two levels deep (v1/, register/, etc.)
        'logo_path': '../../assets/presentations_ai_white.svg',
        'overview_path': '../../mainpages/index.html',
        'api_ref_path': '../../quickstart.html',
    },
    3: {  # Three levels deep (mcp-v1/, credits/)
        'logo_path': '../../../assets/presentations_ai_white.svg',
        'overview_path': '../../../mainpages/index.html',
        'api_ref_path': '../../../quickstart.html',
    }
}

def get_path_depth(file_path):
    """Calculate relative depth from docs/ directory"""
    parts = Path(file_path).relative_to('docs').parts
    return len(parts) - 1  # -1 because file itself doesn't count

def get_header_template(depth, active_tab='overview'):
    """Generate header HTML based on depth and active tab"""
    config = HEADER_TEMPLATES.get(depth, HEADER_TEMPLATES[2])
    
    overview_class = 'px-3 py-1.5 rounded-md bg-accent-blue text-white text-sm font-medium flex items-center space-x-1.5' if active_tab == 'overview' else 'px-3 py-1.5 rounded-md text-white hover:bg-blue-800 text-sm font-medium flex items-center space-x-1.5'
    api_class = 'px-3 py-1.5 rounded-md bg-accent-blue text-white text-sm font-medium flex items-center space-x-1.5' if active_tab == 'api-reference' else 'px-3 py-1.5 rounded-md text-white hover:bg-blue-800 text-sm font-medium flex items-center space-x-1.5'
    
    return f'''    <!-- Header -->
    <header class="bg-primary-blue text-white sticky top-0 z-50">
        <div class="max-w-full mx-auto">
            <!-- Top Row: Logo and Login/Theme -->
            <div class="flex items-center justify-between h-12 px-6 border-b border-blue-800/50">
                <div class="flex items-center space-x-3">
                    <img id="header-logo" src="{config['logo_path']}" alt="Presentations.AI" class="h-8" style="max-width: 180px;">
                </div>
            <div class="flex items-center space-x-4">
                    <a id="login-link" href="/docs/login" class="text-white hover:text-gray-200 text-sm">Log In</a>
                    <script>
                        (function() {{
                            const hostname = window.location.hostname;
                            let loginUrl;
                            if (hostname.includes('dev-apis') || hostname.includes('devmcp')) {{
                                loginUrl = 'https://dev-apis.presentations.ai/docs/login';
                            }} else if (hostname.includes('developers')) {{
                                loginUrl = 'https://developers.presentations.ai/docs/login';
                            }} else {{
                                loginUrl = window.location.origin + '/docs/login';
                            }}
                            const loginLink = document.getElementById('login-link');
                            if (loginLink) {{
                                loginLink.href = loginUrl;
                            }}
                        }})();
                    </script>
                    <button class="text-white hover:text-gray-200 p-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <!-- Bottom Row: Navigation and Search -->
            <div class="flex items-center justify-between h-12 px-6">
                <nav class="hidden md:flex items-center space-x-1">
                    <a href="{config['overview_path']}" class="{overview_class}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <span>Overview</span>
                    </a>
                    <a href="{config['api_ref_path']}" class="{api_class}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                        <span>API Reference</span>
                    </a>
                </nav>
                <div class="flex items-center">
                    <div class="relative">
                        <input type="text" placeholder="Search" class="bg-blue-900/50 border border-blue-700 text-white placeholder-gray-300 px-3 py-1.5 rounded text-sm w-40 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400">
                        <span class="absolute right-2.5 top-1.5 text-gray-400 text-xs">⌘K</span>
                    </div>
                </div>
            </div>
        </div>
    </header>'''

def update_tailwind_config(content):
    """Update Tailwind config to remove gamma references"""
    # Replace color definitions
    content = re.sub(
        r"'gamma-blue':\s*'#1e3a8a'",
        "'primary-blue': '#1e3a8a'",
        content
    )
    content = re.sub(
        r"'gamma-purple':\s*'#a855f7'",
        "'accent-blue': '#3b82f6'",
        content
    )
    content = re.sub(
        r"'gamma-light-purple':\s*'#e9d5ff'",
        "'light-accent': '#e0e7ff'",
        content
    )
    return content

def update_class_names(content):
    """Replace all gamma class names with generic names"""
    for old, new in COLOR_REPLACEMENTS.items():
        content = content.replace(old, new)
    return content

def update_sidebar_positioning(content):
    """Update sidebar sticky positioning for new header height"""
    # Header is now 24 (h-12 + h-12 = 24), so sidebar should be top-24
    content = re.sub(r'top-14 h-\[calc\(100vh-3\.5rem\)\]', 'top-24 h-[calc(100vh-6rem)]', content)
    content = re.sub(r'top-16 h-\[calc\(100vh-4rem\)\]', 'top-24 h-[calc(100vh-6rem)]', content)
    return content

def determine_active_tab(file_path):
    """Determine which tab should be active based on file path"""
    path_str = str(file_path)
    if 'mainpages/index.html' in path_str or 'index.html' in path_str:
        return 'overview'
    elif 'quickstart' in path_str:
        return 'api-reference'
    else:
        return 'api-reference'  # Most pages are API reference

def update_html_file(file_path):
    """Update a single HTML file"""
    print(f"Updating {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update Tailwind config
    content = update_tailwind_config(content)
    
    # Update class names
    content = update_class_names(content)
    
    # Update sidebar positioning
    content = update_sidebar_positioning(content)
    
    # Replace header section
    depth = get_path_depth(file_path)
    active_tab = determine_active_tab(file_path)
    new_header = get_header_template(depth, active_tab)
    
    # Find and replace header section
    header_pattern = r'<!-- Header -->.*?</header>'
    content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated {file_path}")

def main():
    """Main function to update all HTML files"""
    docs_dir = Path('docs')
    html_files = list(docs_dir.rglob('*.html'))
    
    # Exclude template files
    html_files = [f for f in html_files if not f.name.startswith('_')]
    
    print(f"Found {len(html_files)} HTML files to update\n")
    
    for html_file in html_files:
        try:
            update_html_file(html_file)
        except Exception as e:
            print(f"✗ Error updating {html_file}: {e}")
    
    print(f"\n✓ Updated {len(html_files)} files")

if __name__ == '__main__':
    os.chdir(Path(__file__).parent)
    main()
