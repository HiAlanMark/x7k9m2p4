#!/usr/bin/env bash
# Sync version from latest git tag to all project version files
# Usage: ./scripts/sync-version.sh

set -e

cd "$(dirname "$0")/.."

# Get latest tag
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -z "$LATEST_TAG" ]; then
  echo "No git tag found. Create a tag first: git tag v0.x.x"
  exit 1
fi

VERSION="${LATEST_TAG#v}"
echo "Syncing version: $VERSION (from $LATEST_TAG)"

# wails.json
if command -v python3 &>/dev/null; then
  python3 -c "
import json
with open('wails.json') as f:
    cfg = json.load(f)
cfg['info']['productVersion'] = '$VERSION'
with open('wails.json', 'w') as f:
    json.dump(cfg, f, indent=2)
    f.write('\n')
print('  wails.json -> $VERSION')
"

  python3 -c "
import json
with open('frontend/package.json') as f:
    pkg = json.load(f)
pkg['version'] = '$VERSION'
with open('frontend/package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
    f.write('\n')
print('  frontend/package.json -> $VERSION')
"
fi

echo "Done. Version synced to $VERSION"
