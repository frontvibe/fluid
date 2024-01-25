import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import type {PartialDeep} from 'type-fest';

import {useLocation} from '@remix-run/react';
import {useMemo} from 'react';

export function useSelectedVariant(props: {
  variants?: Array<PartialDeep<ProductVariant>>;
}) {
  const {search} = useLocation();
  const searchParams = new URLSearchParams(search);
  const variantIdParam = searchParams.get('variant');

  const firstAvailableVariant = useMemo(
    () => props.variants?.find((variant) => variant?.availableForSale),
    [props.variants],
  );

  const firstVariantFound = useMemo(() => {
    return props.variants?.[0];
  }, [props.variants]);

  const selectedVariant = useMemo(() => {
    if (variantIdParam) {
      return props.variants?.find((variant) => {
        return variant.id?.includes(variantIdParam);
      });
    }

    return null;
  }, [props.variants, variantIdParam]);

  if (!selectedVariant) {
    return firstAvailableVariant ?? firstVariantFound;
  }

  return selectedVariant;
}
