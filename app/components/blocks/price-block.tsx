import type {SectionOfType} from 'types';
import type {ProductCardFragment} from 'types/shopify/storefrontapi.generated';

import {stegaClean} from '@sanity/client/stega';

import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

import {Badge} from '../ui/badge';
import {VariantPrice} from '../product/variant-price';
import {useProduct} from '../product/product-provider';

export type PriceBlockProps = NonNullable<
  SectionOfType<'productInformationSection'>['richtext']
>[number] & {
  _type: 'price';
};

export function PriceBlock(props: PriceBlockProps) {
  const {product, selectedVariant} = useProduct();

  if (!product) return null;

  return (
    <Layout>
      <VariantPrice selectedVariant={selectedVariant} />
      <ProductBadges selectedVariant={selectedVariant} />
    </Layout>
  );
}

function Layout({children}: {children: React.ReactNode}) {
  return <div className="flex items-center gap-3">{children}</div>;
}

export function ProductBadges({
  layout,
  selectedVariant,
}: {
  layout?: 'card';
  selectedVariant?: ProductCardFragment['selectedOrFirstAvailableVariant'];
}) {
  const {sanityRoot} = useRootLoaderData();
  const data = sanityRoot?.data;
  const {themeContent} = useSanityThemeContent();
  const isSoldOut = !selectedVariant?.availableForSale;
  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    parseFloat(selectedVariant?.price?.amount) <
      parseFloat(selectedVariant?.compareAtPrice?.amount);
  const badgesPosition = stegaClean(data?.settings?.badgesPosition);

  const badgeClass = cn(
    'rounded-(--badges-corner-radius) bg-background text-foreground hover:bg-background',
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
