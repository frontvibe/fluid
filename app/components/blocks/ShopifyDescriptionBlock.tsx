import type {InferType, TypeFromSelection} from 'groqd';

import {useLoaderData} from '@remix-run/react';

import type {SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT} from '~/qroq/blocks';
import type {loader} from '~/routes/($locale).products.$productHandle';

export type ShopifyDescriptionBlockProps = TypeFromSelection<
  typeof SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT
>;

export function ShopifyDescriptionBlock(props: ShopifyDescriptionBlockProps) {
  const {product} = useLoaderData<typeof loader>();

  return product ? (
    <div
      dangerouslySetInnerHTML={{
        __html: product.descriptionHtml,
      }}
    ></div>
  ) : null;
}
