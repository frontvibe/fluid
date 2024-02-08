import type {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';

import {Await, Link} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';

import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useRootLoaderData} from '~/hooks/useRootLoaderData';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

import {useDevice} from '../../hooks/useDevice';
import {Cart} from '../cart/Cart';
import {IconBag} from '../icons/IconBag';
import {IconLoader} from '../icons/IconLoader';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/Drawer';

export function CartDrawer() {
  const rootData = useRootLoaderData();

  return (
    <Suspense fallback={<Badge count={0} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => <Badge cart={cart} count={cart?.totalQuantity || 0} />}
      </Await>
    </Suspense>
  );
}

function Badge(props: {cart?: CartType | null; count: number}) {
  const {count} = props;
  const isHydrated = useIsHydrated();
  const path = useLocalePath({path: '/cart'});
  const {themeContent} = useSanityThemeContent();
  const [cartOpen, setCartOpen] = useState(false);
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const device = useDevice();
  const cartIsLoading = Boolean(addToCartFetchers.length);

  const handleOpen = useCallback(() => {
    if (cartOpen || !addToCartFetchers.length) return;
    setCartOpen(true);
  }, [addToCartFetchers, cartOpen]);

  const handleClose = useCallback(() => {
    setCartOpen(false);
  }, []);

  // Toggle cart drawer when adding to cart
  useEffect(() => {
    handleOpen();
  }, [addToCartFetchers, handleOpen]);

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag className="size-6" />
        {isHydrated && count > 0 && (
          <div
            className={cx([
              'absolute right-[-8px] top-0 flex items-center justify-center',
              'bg-foreground text-background',
              'aspect-square h-auto min-w-[1.35rem] rounded-full p-1',
              'text-center text-[.7rem] leading-[0] subpixel-antialiased',
            ])}
          >
            <span>{count}</span>
          </div>
        )}
      </>
    ),
    [count, isHydrated],
  );

  const buttonClass = cx([
    'relative flex size-8 items-center justify-center',
    count > 0 && 'mr-3 lg:mr-0',
  ]);

  return isHydrated ? (
    <Drawer
      direction={device === 'desktop' ? 'right' : 'bottom'}
      onOpenChange={setCartOpen}
      open={cartOpen}
    >
      <DrawerTrigger className={buttonClass}>{BadgeCounter}</DrawerTrigger>
      <DrawerContent
        className="flex h-[97.5dvh] max-h-screen w-screen flex-col gap-0 bg-background p-0 text-foreground lg:left-auto lg:right-0 lg:h-[100dvh] lg:max-w-lg"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader className="px-6 py-5 shadow-sm shadow-foreground/10">
          <DrawerTitle className="flex items-center gap-4">
            <span>{themeContent?.cart.heading}</span>
            {cartIsLoading && <IconLoader className="animate-spin" />}
          </DrawerTitle>
        </DrawerHeader>
        <Cart
          cart={props.cart}
          layout="drawer"
          loading={cartIsLoading}
          onClose={handleClose}
        />
      </DrawerContent>
    </Drawer>
  ) : (
    <Link className={buttonClass} prefetch="intent" to={path}>
      {BadgeCounter}
    </Link>
  );
}
