#!/bin/bash
# Hermes Desktop - Setup & Run Script
# Supports macOS and Windows (via Git Bash/WSL)

set -e

echo "========================================="
echo "  Hermes Desktop - Setup & Launch"
echo "========================================="

# Check prerequisites
echo "[1/4] Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "Node.js is required. Install it from https://nodejs.org/"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "Rust/Cargo is required. Install it from https://rustup.rs/"
    exit 1
fi

echo "  Node: $(node --version)"
echo "  Cargo: $(cargo --version)"

# Install frontend dependencies
echo "[2/4] Installing frontend dependencies..."
npm install

# Fetch Rust dependencies
echo "[3/4] Fetching Rust dependencies..."
cd src-tauri
cargo fetch
cd ..

# Build/Run
echo "[4/4] Starting Hermes Desktop in development mode..."
echo "  Press Ctrl+C to stop."
npm run tauri dev
