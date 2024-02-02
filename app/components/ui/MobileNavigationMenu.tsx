import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import {cn} from 'app/lib/utils';
import React, {forwardRef} from 'react';

import {IconChevron} from '../icons/IconChevron';

const MobileNavigationMenu = forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({children, className, ...props}, ref) => (
  <NavigationMenuPrimitive.Root
    className={cn('container relative py-[var(--viewport-top)]', className)}
    ref={ref}
    {...props}
    style={
      {
        '--viewport-top': '3.5rem',
      } as React.CSSProperties
    }
  >
    {children}
    <MobileNavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
MobileNavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const MobileNavigationMenuList = forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({className, ...props}, ref) => (
  <NavigationMenuPrimitive.List
    className={cn('flex flex-col gap-4', className)}
    ref={ref}
    {...props}
  />
));
MobileNavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const MobileNavigationMenuItem = NavigationMenuPrimitive.Item;

const MobileNavigationMenuTrigger = forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({children, className, ...props}, ref) => (
  <NavigationMenuPrimitive.Trigger
    className={cn(
      'group data-[state=open]:fixed data-[state=open]:top-4 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=open]:fade-in',
      className,
    )}
    ref={ref}
    {...props}
  >
    <span className="flex items-center gap-2">
      <span className="group-data-[state=open]:hidden">{children}</span>
      <IconChevron
        className="group-data-[state=open]:size-7 group-data-[state=open]:rotate-180"
        direction="right"
      />
    </span>
  </NavigationMenuPrimitive.Trigger>
));
MobileNavigationMenuTrigger.displayName =
  NavigationMenuPrimitive.Trigger.displayName;

const MobileNavigationMenuContent = forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({className, ...props}, ref) => (
  <NavigationMenuPrimitive.Content
    className={cn(
      [
        'h-[calc(100dvh-var(--viewport-top))] w-screen transition ease-in-out',
        'group-data-[state=open]:duration-500',
        'group-data-[state=open]:animate-in',
        'group-data-[state=open]:fade-in',
      ],
      className,
    )}
    onInteractOutside={(e) => e.preventDefault()}
    ref={ref}
    {...props}
  >
    <div className="flex h-full max-h-screen min-h-full w-screen flex-col gap-0">
      <div className="container flex h-full flex-1 flex-col gap-3 overflow-y-scroll pb-[var(--viewport-top)] pt-4">
        {props.children}
      </div>
    </div>
  </NavigationMenuPrimitive.Content>
));
MobileNavigationMenuContent.displayName =
  NavigationMenuPrimitive.Content.displayName;

const MobileNavigationMenuLink = NavigationMenuPrimitive.Link;

const MobileNavigationMenuViewport = forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({className, ...props}, ref) => (
  <NavigationMenuPrimitive.Viewport
    className={cn([
      'group fixed left-0 top-[var(--viewport-top)] z-50',
      'h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)]',
      'bg-background text-foreground transition ease-in-out',
      'data-[state=closed]:duration-300',
      'data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out',
      className,
    ])}
    ref={ref}
    {...props}
  />
));
MobileNavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

export {
  MobileNavigationMenu,
  MobileNavigationMenuContent,
  MobileNavigationMenuItem,
  MobileNavigationMenuLink,
  MobileNavigationMenuList,
  MobileNavigationMenuTrigger,
  MobileNavigationMenuViewport,
};
