#!/usr/bin/env python3
"""
Update all HTML files with two-row header structure matching Gamma's design
"""

import re
import os
from pathlib import Path

def get_header_for_depth(depth, active_tab='api-reference'):
    """Generate two-row header based on depth"""
    paths = {
        0: {'logo': '../assets/presentations_ai_white.svg', 'overview': 'index.html', 'api': '../quickstart.html'},
        1: {'logo': 'assets/presentations_ai_white.svg', 'overview': 'mainpages/index.html', 'api': 'quickstart.html'},
        2: {'logo': '../../assets/presentations_ai_white.svg', 'overview': '../../mainpages/index.html', 'api': '../../quickstart.html'},
        3: {'logo': '../../../assets/presentations_ai_white.svg', 'overview': '../../../mainpages/index.html', 'api': '../../../quickstart.html'},
    }
    p = paths.get(depth, paths[2])
    
    overview_class = 'px-3 py-1.5 rounded-md bg-accent-blue text-white text-sm font-medium flex items-center space-x-1.5' if active_tab == 'overview' else 'px-3 py-1.5 rounded-md text-white hover:bg-blue-800 text-sm font-medium flex items-center space-x-1.5'
    api_class = 'px-3 py-1.5 rounded-md bg-accent-blue text-white text-sm font-medium flex items-center space-x-1.5' if active_tab == 'api-reference' else 'px-3 py-1.5 rounded-md text-white hover:bg-blue-800 text-sm font-medium flex items-center space-x-1.5'
    
    return f'''    <!-- Header -->
    <header class="bg-primary-blue text-white sticky top-0 z-50">
        <div class="max-w-full mx-auto">
            <!-- Top Row: Logo and Login/Theme -->
            <div class="flex items-center justify-between h-12 px-6 border-b border-blue-800/50">
                <div class="flex items-center space-x-3">
                    <img id="header-logo" src="{p['logo']}" alt="Presentations.AI" class="h-8" style="max-width: 180px;">
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
                    <a href="{p['overview']}" class="{overview_class}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <span>Overview</span>
                    </a>
                    <a href="{p['api']}" class="{api_class}">
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

def get_depth(filepath):
    """Get depth from docs/ directory"""
    filepath_str = str(filepath)
    if 'docs/' in filepath_str:
        rel_path = Path(filepath_str.split('docs/')[1])
    else:
        rel_path = Path(filepath_str)
    return len(rel_path.parts) - 1

def determine_active_tab(filepath):
    """Determine active tab"""
    if 'mainpages/index.html' in str(filepath) or filepath.endswith('index.html'):
        return 'overview'
    return 'api-reference'

def update_file(filepath):
    """Update a single HTML file"""
    print(f"Updating {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace header section
    depth = get_depth(filepath)
    active_tab = determine_active_tab(filepath)
    new_header = get_header_for_depth(depth, active_tab)
    
    # Match and replace header (flexible pattern)
    header_pattern = r'<!-- Header -->.*?</header>'
    content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated {filepath}")

def main():
    base_dir = Path(__file__).parent / 'docs'
    os.chdir(base_dir)
    
    html_files = [
        'v1/document-file.html',
        'v1/content-document.html',
        'v1/document-slide.html',
        'register/register.html',
        'mcp-v1/create-document-from-content.html',
        'error-handling.html',
        'credits/credits.html'
    ]
    
    for filepath in html_files:
        full_path = base_dir / filepath
        if full_path.exists():
            try:
                update_file(str(full_path))
            except Exception as e:
                print(f"✗ Error: {filepath} - {e}")
    
    print("\n✓ All files updated!")

if __name__ == '__main__':
    main()
