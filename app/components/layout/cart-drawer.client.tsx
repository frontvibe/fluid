import type {CartReturn} from '@shopify/hydrogen';

import {useDevice} from '~/hooks/use-device';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';

import {Cart} from '../cart';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';

export function CartDrawer(props: {
  BadgeCounter: React.ReactNode;
  buttonClass: string;
  cart?: CartReturn | null;
  cartIsLoading: boolean;
  cartOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    buttonClass,
    cartOpen,
    onOpenChange,
    onClose,
    BadgeCounter,
    cartIsLoading,
    cart,
  } = props;

  const device = useDevice();
  const {themeContent} = useSanityThemeContent();

  return (
    <Drawer
      direction={device === 'desktop' ? 'right' : 'bottom'}
      onOpenChange={onOpenChange}
      open={cartOpen}
    >
      <DrawerTrigger className={buttonClass}>{BadgeCounter}</DrawerTrigger>
      <DrawerContent
        className="cart flex h-[97.5svh] max-h-screen w-screen flex-col gap-0 bg-background p-0 text-foreground lg:right-0 lg:left-auto lg:h-svh lg:max-w-lg"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader className="px-6 py-5 shadow-xs shadow-foreground/10">
          <DrawerTitle className="flex items-center gap-4 font-body font-bold">
            <span>{themeContent?.cart?.heading}</span>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="sr-only">
          {themeContent?.cart?.heading}
        </DrawerDescription>
        <Cart
          cart={cart}
          layout="drawer"
          loading={cartIsLoading}
          onClose={onClose}
        />
      </DrawerContent>
    </Drawer>
  );
}
