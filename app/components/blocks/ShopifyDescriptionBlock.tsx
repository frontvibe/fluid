import type {TypeFromSelection} from 'groqd';

import {useProduct} from '@shopify/hydrogen-react';

import type {SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT} from '~/qroq/blocks';

export type ShopifyDescriptionBlockProps = TypeFromSelection<
  typeof SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT
>;

export function ShopifyDescriptionBlock(props: ShopifyDescriptionBlockProps) {
  const {product} = useProduct();

  if (!product || !product.descriptionHtml) return null;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: product.descriptionHtml,
      }}
    ></div>
  );
}
