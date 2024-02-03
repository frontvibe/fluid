import {cn} from 'app/lib/utils';
import * as React from 'react';
import {forwardRef} from 'react';
import {Drawer as DrawerPrimitive} from 'vaul';

import {IconClose} from '../icons/IconClose';

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerNestedRoot = DrawerPrimitive.NestedRoot;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({className, ...props}, ref) => (
  <DrawerPrimitive.Overlay
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    ref={ref}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({children, className, ...props}, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-3xl border bg-background md:rounded-none',
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted md:hidden" />
      {children}
      <DrawerClose className="absolute right-4 top-4 hidden rounded-sm ring-offset-background transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary md:block">
        <IconClose className="size-6" strokeWidth={2} />
        <span className="sr-only">Close</span>
      </DrawerClose>
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({className, ...props}, ref) => (
  <DrawerPrimitive.Title
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    ref={ref}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({className, ...props}, ref) => (
  <DrawerPrimitive.Description
    className={cn('text-sm text-muted-foreground', className)}
    ref={ref}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerNestedRoot,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
