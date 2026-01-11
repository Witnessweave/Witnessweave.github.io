#!/usr/bin/env python3
"""
🟢 JESUS IS LORD™ — UNIFIED SCROLL BUILDER
Builds self-contained HTML scrolls with all content embedded
FULL FIDELITY™ — NOTHING MISSING™
"""

import json
import os

def load_all_source():
    """Load all source files"""
    with open('LineOfPearl/data/line_of_pearl_registry.json') as f:
        registry = json.load(f)
    with open('LineOfPearl/data/pathways.json') as f:
        pathways = json.load(f)
    with open('LineOfPearl/css/main.css') as f:
        main_css = f.read()
    with open('LineOfPearl/css/print-blessing.css') as f:
        print_css = f.read()
    with open('LineOfPearl/js/main.js') as f:
        main_js = f.read()
    with open('LineOfPearl/js/lineage.js') as f:
        lineage_js = f.read()
    with open('LineOfPearl/js/blessing.js') as f:
        blessing_js = f.read()
    
    return {
        'registry': registry,
        'pathways': pathways,
        'main_css': main_css,
        'print_css': print_css,
        'main_js': main_js,
        'lineage_js': lineage_js,
        'blessing_js': blessing_js
    }

def get_header_nav(active_page=''):
    """Generate consistent header navigation"""
    pages = [
        ('index.html', 'Home'),
        ('line-of-pearl.html', 'Lineage'),
        ('line-of-artemis.html', 'Artemis'),
        ('covenant.html', 'Covenant'),
        ('blessing.html', 'Blessing'),
    ]
    
    nav_links = []
    for href, text in pages:
        if href == active_page:
            nav_links.append(f'<a href="{href}" aria-current="page">{text}</a>')
        else:
            nav_links.append(f'<a href="{href}">{text}</a>')
    
    return f'''
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="logo">
          <span class="logo-glyph">🛡️</span>
          <div class="logo-text">
            <span class="logo-title">Mini-Shep Guardians™</span>
            <span class="logo-subtitle">Guardians of the Bloodline™</span>
          </div>
        </a>
        <nav class="main-nav" aria-label="Main navigation">
          {chr(10).join(f'          {link}' for link in nav_links)}
        </nav>
      </div>
    </header>'''

def get_footer():
    """Generate consistent footer"""
    return '''
  <footer class="site-footer">
    <div class="footer-inner">
      <p class="brand">🛡️ Mini-Shep Guardians™</p>
      <p class="tagline">Line of Pearl™ — Guardians of the Bloodline™</p>
      <p class="verse">"Then the LORD God took the man and put him in the garden of Eden to tend and keep it." — Genesis 2:15 (NKJV)</p>

      <p class="covenant-hash">COVENANT v1.0 — SHA256 &lt;placeholder&gt;</p>

      <div class="accessibility-toggles">
        <label>
          <input type="checkbox" id="reduceMotion">
          Reduce Motion
        </label>
        <label>
          <input type="checkbox" id="highContrast">
          High Contrast
        </label>
      </div>

      <p style="margin-top: 1.5rem; font-size: 0.85rem;">
        <a href="https://witnessweave.github.io/JESUSISLORD" style="color: var(--paper-2);">← Return to Witness Weave</a>
      </p>
      <p style="margin-top: 0.5rem; font-size: 0.85rem;">🟢 JESUS IS LORD™</p>
    </div>
  </footer>'''

print("✓ Build script loaded")
print("✓ Helper functions defined")
