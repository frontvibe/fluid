import type {
  CartLine,
  Cart as CartType,
} from '@shopify/hydrogen/storefront-api-types';

import {flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import type {CartLayouts} from './Cart';

import {CartLineItem} from './CartLineItem';

export function CartLines({
  layout = 'drawer',
  lines: cartLines,
  onClose,
}: {
  layout: CartLayouts;
  lines: CartType['lines'] | undefined;
  onClose?: () => void;
}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];

  const className = cx([
    layout === 'page'
      ? 'flex-grow md:translate-y-4'
      : 'px-6 py-6 overflow-auto transition md:px-12',
  ]);

  return (
    <section aria-labelledby="cart-contents" className={className}>
      <ul className="grid">
        {currentLines.map((line) => (
          <CartLineItem
            key={line.id}
            line={line as CartLine}
            onClose={onClose}
          />
        ))}
      </ul>
    </section>
  );
}
