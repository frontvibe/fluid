#!/bin/bash
set -e

# Print commands for debugging
set -x

echo "Installing Netlify-specific dependencies..."
pnpm add @netlify/edge-functions @netlify/remix-edge-adapter @netlify/remix-runtime

echo "Updating files before build..."
# Add any file modifications here
# For example:
# sed -i 's/oldtext/newtext/g' path/to/file

echo "Running build command..."
# pnpm run remix vite:build

echo "Build completed successfully!"
