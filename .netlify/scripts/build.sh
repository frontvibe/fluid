#!/bin/bash
set -e

# Print commands for debugging
set -x

echo "Installing Netlify-specific dependencies..."
pnpm add @netlify/edge-functions @netlify/remix-edge-adapter @netlify/remix-runtime

echo "Updating files before build..."
# Replace all occurrences of @shopify/remix-oxygen with @netlify/remix-runtime
find . -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "@shopify/remix-oxygen" | xargs sed -i 's/@shopify\/remix-oxygen/@netlify\/remix-runtime/g'
echo "Replaced @shopify/remix-oxygen with @netlify/remix-runtime"

echo "Running build command..."
pnpm run remix vite:build

echo "Build completed successfully!"
