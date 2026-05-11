#!/bin/bash
set -e

echo "=== Hermes Desktop Build Script ==="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required"
    exit 1
fi

# Check Rust
if ! command -v cargo &> /dev/null; then
    echo "Error: Rust/Cargo is required"
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd "$(dirname "$0")/.."
pnpm install || npm install

# Build
echo "Building Hermes Desktop..."
npm run tauri build

echo "Build complete!"
echo "Output: src-tauri/target/release/bundle/"
