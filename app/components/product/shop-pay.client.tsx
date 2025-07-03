import {ShopPayButton} from '@shopify/hydrogen';

import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

export function ShopPay({
  isLoading,
  isOutOfStock,
  quantity,
  variantId,
}: {
  isLoading: boolean;
  isOutOfStock: boolean;
  quantity: number;
  variantId: string;
}) {
  const {env} = useRootLoaderData();
  return (
    <ShopPayButton
      className={cn([
        (isLoading || isOutOfStock) && 'pointer-events-none cursor-default',
        isOutOfStock && 'opacity-50',
      ])}
      storeDomain={`https://${env.PUBLIC_STORE_DOMAIN}`}
      variantIdsAndQuantities={[
        {
          id: variantId,
          quantity,
        },
      ]}
    />
  );
}
