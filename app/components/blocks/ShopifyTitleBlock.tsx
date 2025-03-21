import type {SectionOfType} from 'types';

import {useParams} from '@remix-run/react';
import {useProduct} from '@shopify/hydrogen-react';

export type ShopifyTitleBlockProps = NonNullable<
  SectionOfType<'productInformationSection'>['richtext']
>[number] & {
  _type: 'shopifyTitle';
};

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
