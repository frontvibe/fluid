import type {Variants} from 'framer-motion';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

import {Money, useOptimisticData} from '@shopify/hydrogen';
import {AnimatePresence} from 'framer-motion';
import {useMemo} from 'react';

import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {CartLayouts} from './Cart';

import {ProgressiveMotionDiv} from '../ProgressiveMotionDiv';
import {Button} from '../ui/Button';
import {Card, CardContent} from '../ui/Card';
import {CartDiscounts} from './CartDiscounts';
import {CartLines} from './CartLines';

export function CartDetails({
  cart,
  layout,
  onClose,
}: {
  cart?: CartApiQueryFragment;
  layout: CartLayouts;
  onClose?: () => void;
}) {
  // @todo: get optimistic cart cost
  let totalQuantity = cart?.totalQuantity;
  const optimisticData = useOptimisticData<{action?: string; lineId?: string}>(
    'cart-line-item',
  );

  if (optimisticData?.action === 'remove' && optimisticData?.lineId) {
    const nextCartLines = cart?.lines?.nodes.filter(
      (line) => line.id !== optimisticData.lineId,
    );

    if (nextCartLines?.length === 0) {
      totalQuantity = 0;
    }
  }

  const cartHasItems = !!cart && totalQuantity && totalQuantity > 0;

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
              exit={'hide'}
              forceMotion={layout === 'drawer'}
              initial={layout === 'drawer' ? 'hide' : 'show'}
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

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  const {themeContent} = useSanityThemeContent();
  if (!checkoutUrl) return null;

  return (
    <div className="mt-2 flex flex-col">
      <Button asChild>
        <a href={checkoutUrl} target="_self">
          {themeContent?.cart.proceedToCheckout}
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
  cost: CartApiQueryFragment['cost'];
  layout: CartLayouts;
}) {
  const {themeContent} = useSanityThemeContent();

  const Content = useMemo(
    () => (
      <div
        aria-labelledby="summary-heading"
        className={cn([
          layout === 'drawer' && 'grid gap-4 border-t border-border p-6',
          layout === 'page' && 'grid gap-6',
        ])}
      >
        <h2 className="sr-only">{themeContent?.cart.orderSummary}</h2>
        <dl className="grid">
          <div className="flex items-center justify-between font-medium">
            <span>{themeContent?.cart.subtotal}</span>
            <span>
              {cost?.subtotalAmount?.amount ? (
                <Money className="tabular-nums" data={cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </span>
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
