import type {CartApiQueryFragment} from 'storefrontapi.generated';

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
  const empty = !cart || Boolean(cart?.totalQuantity === 0);

  return (
    <>
      <CartEmpty layout={layout} onClose={onClose} show={!loading && empty} />
      <CartDetails cart={cart} layout={layout} onClose={onClose} />
    </>
  );
}
