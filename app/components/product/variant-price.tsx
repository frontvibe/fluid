import type {ProductVariantFragment} from 'types/shopify/storefrontapi.generated';
import {ShopifyMoney} from '../shopify-money';

export function VariantPrice({
  selectedVariant,
}: {
  selectedVariant?: ProductVariantFragment | null;
}) {
  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;

  return (
    <>
      {compareAtPrice && (
        <ShopifyMoney
          className="text-muted-foreground line-through"
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
