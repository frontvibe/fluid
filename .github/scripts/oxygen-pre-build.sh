#!/bin/bash

# List of environment variables that need to be updated
ENV_VARS=(
  "PRIVATE_STOREFRONT_API_TOKEN"
  "PUBLIC_CHECKOUT_DOMAIN"
  "PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID"
  "PUBLIC_CUSTOMER_ACCOUNT_API_URL"
  "PUBLIC_STORE_DOMAIN"
  "PUBLIC_STOREFRONT_API_TOKEN"
  "PUBLIC_STOREFRONT_ID"
  "SHOP_ID"
)

# Path to the env.server.ts file
ENV_FILE="app/lib/env.server.ts"

# Process each environment variable
for var in "${ENV_VARS[@]}"; do
  # Replace env.VAR with env._VAR
  sed -i "s/env\.$var/env._$var/g" "$ENV_FILE"
done

echo "Environment variables have been updated successfully!" 