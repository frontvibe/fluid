import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {useSelectedVariant} from '~/hooks/useSelectedVariant';

import {ShopifyMoney} from '../ShopifyMoney';

export function VariantPrice({
  variants,
}: {
  variants: ProductVariantFragmentFragment[];
}) {
  const selectedVariant = useSelectedVariant({variants});
  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;

  return (
    <>
      {compareAtPrice && (
        <ShopifyMoney
          className=" text-muted-foreground line-through"
          data={compareAtPrice}
        />
      )}
      {price && <ShopifyMoney className="text-lg" data={price} />}
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
