import type {TypeFromSelection} from 'groqd';

import {useParams} from '@remix-run/react';
import {useProduct} from '@shopify/hydrogen-react';

import type {SHOPIFY_TITLE_BLOCK_FRAGMENT} from '~/qroq/blocks';

export type ShopifyTitleBlockProps = TypeFromSelection<
  typeof SHOPIFY_TITLE_BLOCK_FRAGMENT
>;

export function ShopifyTitleBlock(props: ShopifyTitleBlockProps) {
  const {product} = useProduct();
  const params = useParams();

  if (!product) return null;

  return params.productHandle ? (
    <h1>{product?.title}</h1>
  ) : (
    <h2>{product?.title}</h2>
  );
}
