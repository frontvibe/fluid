#!/bin/bash
set -e

# Print commands for debugging
set -x

echo "Installing Netlify-specific dependencies..."
pnpm add @netlify/edge-functions @netlify/remix-edge-adapter @netlify/remix-runtime
pnpm install

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

echo "Updating package.json build script..."
# Use node to update the package.json file
node -e '
const fs = require("fs");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
packageJson.scripts.build = "remix vite:build";
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\n");
console.log("Updated build script in package.json");
'

echo "Replacing server.ts with .netlify/server.ts..."
if [ -f ".netlify/server.ts" ]; then
  cp .netlify/server.ts server.ts
  echo "Successfully replaced server.ts with .netlify/server.ts"
else
  echo "Warning: .netlify/server.ts not found, skipping server replacement"
fi

echo "Replacing context.ts with .netlify/context.ts..."
if [ -f ".netlify/context.ts" ]; then
  cp .netlify/context.ts app/lib/context.ts
  echo "Successfully replaced context.ts with .netlify/context.ts"
else
  echo "Warning: .netlify/context.ts not found, skipping context replacement"
fi

echo "Replacing entry.server.tsx with .netlify/entry.server.tsx..."
if [ -f ".netlify/entry.server.tsx" ]; then
  cp .netlify/entry.server.tsx app/entry.server.tsx
  echo "Successfully replaced entry.server.tsx with .netlify/entry.server.tsx"
else
  echo "Warning: .netlify/entry.server.ts not found, skipping entry.server replacement"
fi

echo "Running build command..."
pnpm run build

echo "Build completed successfully!"
