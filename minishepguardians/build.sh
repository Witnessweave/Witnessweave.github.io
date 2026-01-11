#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# LINE OF PEARL™ — BUILD SCRIPT
# JESUS IS LORD™
# ═══════════════════════════════════════════════════════════════════════════════

set -e

echo "🛡️ Line of Pearl™ — Build Starting..."
echo ""

# Create dist directory
mkdir -p dist

# Copy all files to dist (excluding dist itself and git)
rsync -a --delete \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude '*.md' \
  --exclude 'build.sh' \
  ./ dist/

echo "✅ Files copied to dist/"

# Generate integrity checksums
echo ""
echo "📋 Generating integrity checksums..."
find ./ -type f \
  ! -path "./dist/*" \
  ! -path "./.git/*" \
  ! -name "checksums.sha256.txt" \
  -exec sha256sum {} \; | sort -k 2 > checksums.sha256.txt

echo "✅ Checksums saved to checksums.sha256.txt"

# Count files
FILE_COUNT=$(find dist -type f | wc -l)
TOTAL_SIZE=$(du -sh dist | cut -f1)

echo ""
echo "═══════════════════════════════════════════════════"
echo "🟢 BUILD COMPLETE"
echo "═══════════════════════════════════════════════════"
echo "Files: $FILE_COUNT"
echo "Size: $TOTAL_SIZE"
echo "Output: ./dist/"
echo ""
echo "To serve locally:"
echo "  cd dist && python3 -m http.server 8080"
echo ""
echo "🟢 JESUS IS LORD™"
