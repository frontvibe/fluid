import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {Money} from '@shopify/hydrogen';

import {useSelectedVariant} from '~/hooks/useSelectedVariant';

export function VariantPrice({
  variants,
}: {
  variants: ProductVariantFragmentFragment[];
}) {
  const selectedVariant = useSelectedVariant({variants});
  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  // Todo => Add sale and sold out badges
  return (
    <>
      {compareAtPrice && (
        <Money
          className="tabular-nums text-muted-foreground line-through"
          data={compareAtPrice}
        />
      )}
      {price && <Money className="text-lg tabular-nums" data={price} />}
    </>
  );
}

export function VariantPriceSkeleton() {
  return (
    <div aria-hidden className="text-lg">
      <span className="opacity-0">Skeleton</span>
    </div>
  );
}
