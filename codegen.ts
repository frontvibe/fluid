import type {CodegenConfig} from '@graphql-codegen/cli';

import {getSchema, pluckConfig, preset} from '@shopify/hydrogen-codegen';

export default {
  generates: {
    './types/shopify/storefrontapi.generated.d.ts': {
      documents: [
        './app/**/*.{ts,tsx}',
        './app/data/shopify/**/*.{ts,tsx}',
        '!./app/data/shopify/customer-account/**/*.{ts,tsx}',
      ],
      preset,
      schema: getSchema('storefront'),
    },
    './types/shopify/customeraccountapi.generated.d.ts': {
      documents: ['./app/data/shopify/customer-account/**/*.{ts,tsx}'],
      preset,
      schema: getSchema('customer-account'),
    },
  },
  overwrite: true,
  pluckConfig,
} as CodegenConfig;
