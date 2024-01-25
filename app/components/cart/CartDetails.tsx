import type {
  CartCost,
  Cart as CartType,
} from '@shopify/hydrogen/storefront-api-types';

import {Money} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import type {CartLayouts} from './Cart';

import {Button} from '../ui/Button';
import {CartDiscounts} from './CartDiscounts';
import {CartLines} from './CartLines';

export function CartDetails({
  cart,
  layout,
  onClose,
}: {
  cart?: CartType | null;
  layout: CartLayouts;
  onClose?: () => void;
}) {
  // @todo: get optimistic cart cost
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <CartDetailsLayout layout={layout}>
      <div className={cx([layout === 'drawer' && 'flex-1 overflow-y-scroll'])}>
        <CartLines layout={layout} lines={cart?.lines} onClose={onClose} />
      </div>
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </CartDetailsLayout>
  );
}

function CartDetailsLayout(props: {
  children: React.ReactNode;
  layout: CartLayouts;
}) {
  return props.layout === 'drawer' ? (
    <>{props.children}</>
  ) : (
    <div className="container grid w-full gap-8 pb-12 md:grid-cols-2 md:items-start md:gap-8 lg:gap-12">
      {props.children}
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-2 flex flex-col">
      <Button asChild>
        <a href={checkoutUrl} target="_self">
          {/* Todo => add theme content string */}
          Continue to Checkout
        </a>
      </Button>
      {/* @todo: <CartShopPayButton cart={cart} /> */}
    </div>
  );
}

function CartSummary({
  children = null,
  cost,
  layout,
}: {
  children?: React.ReactNode;
  cost: CartCost;
  layout: CartLayouts;
}) {
  const summary = {
    drawer: cx('grid gap-4 p-6 border-t md:px-12'),
    page: cx('sticky grid gap-6 p-4 md:px-6 md:translate-y-4 rounded w-full'),
  };

  return (
    <section aria-labelledby="summary-heading" className={summary[layout]}>
      <h2 className="sr-only" id="summary-heading">
        {/* Todo => add theme content string */}
        Order summary
      </h2>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium">
          {/* Todo => add theme content string */}
          <span>Subtotal</span>
          <span>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
      </dl>
      {children}
    </section>
  );
}
