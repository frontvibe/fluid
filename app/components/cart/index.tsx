import type {CartReturn} from '@shopify/hydrogen';

import {useOptimisticCart} from '@shopify/hydrogen';

import {CartDetails} from './cart-details';
import {CartEmpty} from './cart-empty';

export type CartLayouts = 'drawer' | 'page';

export function Cart({
  cart: originalCart,
  layout,
  loading,
  onClose,
}: {
  cart?: CartReturn | null;
  layout: CartLayouts;
  loading?: boolean;
  onClose?: () => void;
}) {
  const cart = useOptimisticCart(originalCart);
  const empty = !cart || Boolean(cart.totalQuantity === 0);

  return (
    <>
      <CartEmpty layout={layout} onClose={onClose} show={!loading && empty} />
      <CartDetails cart={cart} layout={layout} onClose={onClose} />
    </>
  );
}
