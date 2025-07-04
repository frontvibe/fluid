import type {IGraphQLConfig} from 'graphql-config';
import {getSchema} from '@shopify/hydrogen-codegen';

/**
 * GraphQL Config
 * @see https://the-guild.dev/graphql/config/docs/user/usage
 * @type {IGraphQLConfig}
 */
export default {
  projects: {
    default: {
      exclude: ['./app/data/shopify/customer-account/*.{ts,tsx,js,jsx}'],
      schema: getSchema('storefront'),
      documents: ['./app/data/shopify/*.{ts,tsx,js,jsx}'],
    },
    customer: {
      schema: getSchema('customer-account'),
      documents: ['./app/data/shopify/customer-account/*.{ts,tsx,js,jsx}'],
    },
  },
} as IGraphQLConfig;
