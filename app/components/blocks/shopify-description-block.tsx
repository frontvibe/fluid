import type {SectionOfType} from 'types';
import {useProduct} from '../product/product-provider';

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
      className="[&_a]:text-primary [&_a]:underline-offset-4 pointer-coarse:[&_a]:active:underline pointer-fine:[&_a]:hover:underline"
      dangerouslySetInnerHTML={{
        __html: product.descriptionHtml,
      }}
    ></div>
  );
}
