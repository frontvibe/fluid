#!/bin/bash
set -e

# Print commands for debugging
set -x

echo "Installing Netlify-specific dependencies..."
pnpm add @netlify/edge-functions @netlify/remix-edge-adapter @netlify/remix-runtime

echo "Updating files before build..."
# Replace all occurrences of @shopify/remix-oxygen with @netlify/remix-runtime
# This approach works on both macOS and Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS version (BSD sed)
  find ./app -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec grep -l "@shopify/remix-oxygen" {} \; | while read file; do
    sed -i '' 's/@shopify\/remix-oxygen/@netlify\/remix-runtime/g' "$file"
  done
else
  # Linux version (GNU sed)
  find ./app -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec grep -l "@shopify/remix-oxygen" {} \; | xargs -r sed -i 's/@shopify\/remix-oxygen/@netlify\/remix-runtime/g'
fi
echo "Replaced @shopify/remix-oxygen with @netlify/remix-runtime"

echo "Running build command..."
pnpm run remix vite:build

echo "Build completed successfully!"
