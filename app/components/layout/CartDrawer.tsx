import type {CartApiQueryFragment} from 'storefrontapi.generated';

import {Await, Link} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';

import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

import {useDevice} from '../../hooks/useDevice';
import {Cart} from '../cart/Cart';
import {IconBag} from '../icons/IconBag';
import {iconButtonClass} from '../ui/Button';
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
      <span className="relative">
        <span className="sr-only">{themeContent?.cart?.heading}</span>
        <IconBag className="size-6" />
        {count > 0 && (
          <div
            className={cx([
              'absolute right-[-12px] top-[-4px] flex items-center justify-center',
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

  return isHydrated ? (
    <Drawer
      direction={device === 'desktop' ? 'right' : 'bottom'}
      onOpenChange={setCartOpen}
      open={cartOpen}
    >
      <DrawerTrigger className={buttonClass}>{BadgeCounter}</DrawerTrigger>
      <DrawerContent
        className="cart flex h-[97.5svh] max-h-screen w-screen flex-col gap-0 bg-background p-0 text-foreground lg:left-auto lg:right-0 lg:h-svh lg:max-w-lg"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader className="px-6 py-5 shadow-sm shadow-foreground/10">
          <DrawerTitle className="flex items-center gap-4 font-body font-bold">
            <span>{themeContent?.cart?.heading}</span>
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
