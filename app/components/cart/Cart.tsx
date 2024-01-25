import type {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';

import {CartDetails} from './CartDetails';
import {CartEmpty} from './CartEmpty';

export type CartLayouts = 'drawer' | 'page';

export function Cart({
  cart,
  layout,
  onClose,
}: {
  cart?: CartType | null;
  layout: CartLayouts;
  onClose?: () => void;
}) {
  const empty = !cart || Boolean(cart?.totalQuantity === 0);

  return (
    <>
      <CartEmpty hidden={!empty} layout={layout} onClose={onClose} />
      <CartDetails cart={cart} layout={layout} onClose={onClose} />
    </>
  );
}
