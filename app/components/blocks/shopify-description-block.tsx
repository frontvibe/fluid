import type {SectionOfType} from 'types';

import {useProduct} from '@shopify/hydrogen-react';

export type ShopifyDescriptionBlockProps = NonNullable<
  SectionOfType<'productInformationSection'>['richtext']
>[number] & {
  _type: 'shopifyDescription';
};

export function ShopifyDescriptionBlock(props: ShopifyDescriptionBlockProps) {
  const {product} = useProduct();

  if (!product || !product.descriptionHtml) return null;

  return (
    <div
      className="[&_a]:text-primary touch:[&_a]:active:underline notouch:[&_a]:hover:underline [&_a]:underline-offset-4"
      dangerouslySetInnerHTML={{
        __html: product.descriptionHtml,
      }}
    ></div>
  );
}
