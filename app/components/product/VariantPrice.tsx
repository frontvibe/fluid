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
    <div className="flex items-center gap-3">
      {compareAtPrice && (
        <Money className="line-through opacity-50" data={compareAtPrice} />
      )}
      {price && <Money className="text-lg" data={price} />}
    </div>
  );
}
