import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';

import {useOptimisticData} from '@shopify/hydrogen';

import {CartDetails} from './CartDetails';
import {CartEmpty} from './CartEmpty';

export type CartLayouts = 'drawer' | 'page';

export function Cart({
  cart,
  layout,
  loading,
  onClose,
}: {
  cart?: CartApiQueryFragment;
  layout: CartLayouts;
  loading?: boolean;
  onClose?: () => void;
}) {
  let totalQuantity = cart?.totalQuantity;
  const optimisticData = useOptimisticData<{
    action?: string;
    line?: CartLineFragment;
    lineId?: string;
  }>('cart-line-item');

  if (optimisticData?.action === 'remove' && optimisticData?.lineId) {
    const nextCartLines = cart?.lines?.nodes.filter(
      (line) => line.id !== optimisticData.lineId,
    );
    if (nextCartLines?.length === 0) {
      totalQuantity = 0;
    }
  } else if (optimisticData?.action === 'add') {
    totalQuantity = optimisticData?.line?.quantity;
  }

  const empty = !cart || Boolean(totalQuantity === 0);

  return (
    <>
      <CartEmpty layout={layout} onClose={onClose} show={!loading && empty} />
      <CartDetails
        checkoutUrl={cart?.checkoutUrl}
        cost={cart?.cost}
        discountCodes={cart?.discountCodes || []}
        layout={layout}
        lines={cart?.lines}
        onClose={onClose}
        totalQuantity={totalQuantity}
      />
    </>
  );
}
