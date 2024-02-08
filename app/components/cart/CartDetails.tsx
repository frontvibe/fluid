import type {
  CartCost,
  Cart as CartType,
} from '@shopify/hydrogen/storefront-api-types';

import {Money} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {AnimatePresence, m} from 'framer-motion';

import type {CartLayouts} from './Cart';

import {Button} from '../ui/Button';
import {DrawerFooter} from '../ui/Drawer';
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
      <CartLines layout={layout} lines={cart?.lines} onClose={onClose} />
      <AnimatePresence>
        {cartHasItems && (
          <m.div
            animate={{
              height: 'auto',
            }}
            exit={{
              height: 0,
            }}
            initial={{
              height: 0,
            }}
          >
            <CartSummary cost={cart.cost} layout={layout}>
              <CartDiscounts discountCodes={cart.discountCodes} />
              <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
            </CartSummary>
          </m.div>
        )}
      </AnimatePresence>
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
        <a data-vaul-no-drag={true} href={checkoutUrl} target="_self">
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
    drawer: cx('grid gap-4 p-6 border-t border-border md:px-12'),
    page: cx('sticky grid gap-6 p-4 md:px-6 md:translate-y-4 rounded w-full'),
  };

  return (
    <div aria-labelledby="summary-heading" className={summary[layout]}>
      <h2 className="sr-only">
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
    </div>
  );
}
