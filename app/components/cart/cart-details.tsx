import type {Variants} from 'motion/react';
import type {CartReturn, OptimisticCart} from '@shopify/hydrogen';

import {CartForm} from '@shopify/hydrogen';
import {AnimatePresence} from 'motion/react';
import {useMemo} from 'react';

import {useCartFetchers} from '~/hooks/use-cart-fetchers';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {cn} from '~/lib/utils';

import type {CartLayouts} from '.';

import {IconLoader} from '../icons/icon-loader';
import {ProgressiveMotionDiv} from '../progressive-motion';
import {ShopifyMoney} from '../shopify-money';
import {Button} from '../ui/button';
import {Card, CardContent} from '../ui/card';
import {CartDiscounts} from './cart-discounts';
import {CartLines} from './cart-lines';

export type OptimisticCartReturn = OptimisticCart<CartReturn | null>;

export function CartDetails({
  cart,
  layout,
  onClose,
}: {
  cart: OptimisticCartReturn | null;
  layout: CartLayouts;
  onClose?: () => void;
}) {
  const totalQuantity = cart?.totalQuantity;
  const cartHasItems = totalQuantity && totalQuantity > 0;

  const drawerMotionVariants: Variants = {
    hide: {
      height: 0,
    },
    show: {
      height: 'auto',
    },
  };

  const pageMotionVariants: Variants = {
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
            <ProgressiveMotionDiv
              animate="show"
              className={cn([
                layout === 'page' &&
                  'lg:sticky lg:top-[var(--desktopHeaderHeight)]',
              ])}
              exit="hide"
              forceMotion={layout === 'drawer'}
              initial="show"
              variants={
                layout === 'drawer' ? drawerMotionVariants : pageMotionVariants
              }
            >
              <CartSummary cart={cart} layout={layout}>
                <CartDiscounts cart={cart} layout={layout} />
                <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
              </CartSummary>
            </ProgressiveMotionDiv>
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
    <div className="container w-full gap-8 pb-12 md:grid md:grid-cols-2 md:items-start md:gap-8 lg:gap-16">
      {props.children}
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  const {themeContent} = useSanityThemeContent();
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const cartIsLoading = Boolean(addToCartFetchers.length);

  return (
    <div className="mt-2 flex flex-col">
      <Button asChild>
        <a
          className={cn(
            (cartIsLoading || !checkoutUrl) &&
              'pointer-events-none cursor-pointer',
          )}
          href={checkoutUrl}
          target="_self"
        >
          {cartIsLoading ? (
            <IconLoader className="size-5 animate-spin" />
          ) : (
            <span>{themeContent?.cart?.proceedToCheckout}</span>
          )}
        </a>
      </Button>
      {/* @todo: <CartShopPayButton cart={cart} /> */}
    </div>
  );
}

function CartSummary({
  children = null,
  cart,
  layout,
}: {
  children?: React.ReactNode;
  cart: OptimisticCartReturn | null;
  layout: CartLayouts;
}) {
  const {themeContent} = useSanityThemeContent();
  const cost = cart?.cost;

  const Content = useMemo(
    () => (
      <div
        aria-labelledby="summary-heading"
        className={cn([
          layout === 'drawer' && 'grid gap-4 border-t border-border p-6',
          layout === 'page' && 'grid gap-6',
        ])}
      >
        <h2 className="sr-only">{themeContent?.cart?.orderSummary}</h2>
        <dl className="grid">
          <div className="flex items-center justify-between font-medium">
            <span>{themeContent?.cart?.subtotal}</span>
            {cost?.subtotalAmount &&
              parseFloat(cost.subtotalAmount.amount ?? '0') > 0 && (
                <span>
                  <ShopifyMoney data={cost?.subtotalAmount} />
                </span>
              )}
          </div>
        </dl>
        {children}
      </div>
    ),
    [children, cost?.subtotalAmount, layout, themeContent],
  );

  if (layout === 'drawer') {
    return Content;
  }

  return (
    <Card className="mt-5">
      <CardContent className="px-5 py-6 lg:p-8">{Content}</CardContent>
    </Card>
  );
}
