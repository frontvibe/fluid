import type {CartApiQueryFragment} from 'types/shopify/storefrontapi.generated';

import {Await, Link} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';

import {useCartFetchers} from '~/hooks/use-cart-fetchers';
import {useLocalePath} from '~/hooks/use-locale-path';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

import {useDevice} from '../../hooks/use-device';
import {ClientOnly} from '../client-only';
import {IconBag} from '../icons/icon-bag';
import {iconButtonClass} from '../ui/button';
import {CartDrawer} from './cart-drawer.client';

export default function CartDrawerWrapper() {
  const rootData = useRootLoaderData();

  return (
    <Suspense fallback={<Badge count={0} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            cart={cart as CartApiQueryFragment}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge(props: {cart?: CartApiQueryFragment; count: number}) {
  const {count, cart} = props;
  const path = useLocalePath({path: '/cart'});
  const {themeContent} = useSanityThemeContent();
  const [cartOpen, setCartOpen] = useState(false);
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const device = useDevice();
  const cartIsLoading = Boolean(addToCartFetchers.length);
  /**
   * Whether the user has manually closed the cart drawer,
   * so we avoid opening it again when addToCartFetchers updates
   */
  const [userClosedCart, setUserClosedCart] = useState(false);

  const handleOpen = useCallback(() => {
    if (!cartOpen && addToCartFetchers.length && !userClosedCart) {
      setCartOpen(true);
    }
  }, [addToCartFetchers, cartOpen, userClosedCart]);

  const onOpenChange = useCallback((open: boolean) => {
    setCartOpen(open);
    if (!open) {
      setUserClosedCart(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    setCartOpen(false);
    setUserClosedCart(true);
  }, []);

  // Reset userClosedCart when fetchers are done
  useEffect(() => {
    if (addToCartFetchers.length === 0) {
      setUserClosedCart(false);
    }
  }, [addToCartFetchers]);

  // Toggle cart drawer when adding to cart
  useEffect(() => {
    handleOpen();
  }, [addToCartFetchers, handleOpen]);

  const BadgeCounter = useMemo(
    () => (
      <span className="relative">
        <span className="sr-only">{themeContent?.cart?.heading}</span>
        <IconBag className="size-6" />
        {count > 0 && (
          <div
            className={cx([
              'absolute top-[-4px] right-[-12px] flex items-center justify-center',
              'bg-foreground text-background transition-colors',
              'group-active:bg-accent-foreground group-active:text-accent',
              'notouch:group-hover:bg-accent-foreground notouch:group-hover:text-accent',
              'aspect-square h-auto min-w-[1.35rem] rounded-full p-1',
              'text-center text-[.7rem] leading-[0] subpixel-antialiased',
            ])}
          >
            <span>{count}</span>
          </div>
        )}
      </span>
    ),
    [count, themeContent?.cart?.heading],
  );

  const buttonClass = cn(iconButtonClass, 'group');

  return (
    <ClientOnly
      fallback={
        <Link className={buttonClass} prefetch="intent" to={path}>
          {BadgeCounter}
        </Link>
      }
    >
      {() => (
        <Suspense>
          <CartDrawer
            BadgeCounter={BadgeCounter}
            buttonClass={buttonClass}
            cart={cart}
            cartIsLoading={cartIsLoading}
            cartOpen={cartOpen}
            onClose={handleClose}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )}
    </ClientOnly>
  );
}
