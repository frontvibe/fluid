import type {TypeFromSelection} from 'groqd';

import {useLoaderData} from '@remix-run/react';

import type {SHOPIFY_TITLE_BLOCK_FRAGMENT} from '~/qroq/blocks';
import type {loader} from '~/routes/($locale).products.$productHandle';

export type ShopifyTitleBlockProps = TypeFromSelection<
  typeof SHOPIFY_TITLE_BLOCK_FRAGMENT
>;

export function ShopifyTitleBlock(props: ShopifyTitleBlockProps) {
  const {product} = useLoaderData<typeof loader>();

  return <h1>{product?.title}</h1>;
}
