import type {SectionOfType} from 'types';
import type {ProductVariantFragmentFragment} from 'types/shopify/storefrontapi.generated';

import {stegaClean} from '@sanity/client/stega';
import {flattenConnection} from '@shopify/hydrogen';
import {useProduct} from '@shopify/hydrogen-react';

import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {useSelectedVariant} from '~/hooks/use-selected-variant';
import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

import {VariantPrice} from '../product/variant-price';
import {useProductVariants} from '../sections/product-information-section';
import {Badge} from '../ui/badge';

export type PriceBlockProps = NonNullable<
  SectionOfType<'productInformationSection'>['richtext']
>[number] & {
  _type: 'price';
};

export function PriceBlock(props: PriceBlockProps) {
  const {product} = useProduct();
  const variantsContextData = useProductVariants();

  if (!product) return null;

  if (variantsContextData?.variants) {
    return (
      <Layout>
        <VariantPrice variants={variantsContextData?.variants} />
        <ProductBadges variants={variantsContextData?.variants} />
      </Layout>
    );
  }

  const variants = product?.variants?.nodes?.length
    ? (flattenConnection(product.variants) as ProductVariantFragmentFragment[])
    : [];

  return (
    <Layout>
      <VariantPrice variants={variants} />
      <ProductBadges variants={variants} />
    </Layout>
  );
}

function Layout({children}: {children: React.ReactNode}) {
  return <div className="flex items-center gap-3">{children}</div>;
}

export function ProductBadges({
  layout,
  variants,
}: {
  layout?: 'card';
  variants: ProductVariantFragmentFragment[];
}) {
  const {sanityRoot} = useRootLoaderData();
  const data = sanityRoot?.data;
  const {themeContent} = useSanityThemeContent();
  const selectedVariant = useSelectedVariant({variants});
  const isSoldOut = !selectedVariant?.availableForSale;
  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    parseFloat(selectedVariant?.price?.amount) <
      parseFloat(selectedVariant?.compareAtPrice?.amount);
  const badgesPosition = stegaClean(data?.settings?.badgesPosition);

  const badgeClass = cn(
    'bg-background text-foreground hover:bg-background rounded-(--badges-corner-radius)',
  );

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        layout === 'card' && 'absolute z-5 m-2',
        layout === 'card' && badgesPosition === 'top_left' && 'top-0 left-0',
        layout === 'card' && badgesPosition === 'top_right' && 'top-0 right-0',
        layout === 'card' &&
          badgesPosition === 'bottom_left' &&
          'bottom-0 left-0',
        layout === 'card' &&
          badgesPosition === 'bottom_right' &&
          'right-0 bottom-0',
        layout === 'card' && !badgesPosition && 'bottom-0 left-0',
      )}
    >
      {isOnSale && !isSoldOut && (
        <Badge className={badgeClass} data-type="sale-badge">
          {themeContent?.product?.sale}
        </Badge>
      )}
      {isSoldOut && (
        <Badge
          className={badgeClass}
          data-type="sold-out-badge"
          variant="secondary"
        >
          {themeContent?.product?.soldOut}
        </Badge>
      )}
    </div>
  );
}
