import type {
  CartCost,
  Cart as CartType,
} from '@shopify/hydrogen/storefront-api-types';

import {Money} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {AnimatePresence, m} from 'framer-motion';

import {cn} from '~/lib/utils';

import type {CartLayouts} from './Cart';

import {Button} from '../ui/Button';
import {Card, CardContent} from '../ui/Card';
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

  const drawerMotionVariants = {
    hide: {
      height: 0,
    },
    show: {
      height: 'auto',
    },
  };

  const pageMotionVariants = {
    hide: {
      opacity: 0,
      transition: {
        duration: 0,
      },
    },
    show: {
      opacity: 1,
    },
  };

  return (
    <CartDetailsLayout layout={layout}>
      <CartLines layout={layout} lines={cart?.lines} onClose={onClose} />
      <div>
        <AnimatePresence>
          {cartHasItems && (
            <m.div
              animate={'show'}
              className={cn([
                layout === 'page' &&
                  'lg:sticky lg:top-[var(--desktopHeaderHeight)]',
              ])}
              exit={'hide'}
              initial={'hide'}
              variants={
                layout === 'drawer' ? drawerMotionVariants : pageMotionVariants
              }
            >
              <CartSummary cost={cart.cost} layout={layout}>
                <CartDiscounts
                  discountCodes={cart.discountCodes}
                  layout={layout}
                />
                <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
              </CartSummary>
            </m.div>
          )}
        </AnimatePresence>
      </div>
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
    <div className="container grid w-full gap-8 pb-12 md:grid-cols-2 md:items-start md:gap-8 lg:gap-16">
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
    page: cx('grid gap-6'),
  };

  const Content = () => (
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

  if (layout === 'drawer') {
    return <Content />;
  }

  return (
    <Card className="mt-5">
      <CardContent className="px-5 py-6 lg:p-8">
        <Content />
      </CardContent>
    </Card>
  );
}
