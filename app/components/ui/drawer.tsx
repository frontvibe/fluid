import {cn} from 'app/lib/utils';
import * as React from 'react';
import {Drawer as DrawerPrimitive} from 'vaul';

import {IconClose} from '../icons/icon-close';
import {iconButtonClass} from './button';

function Drawer({
  onOpenChange,
  open,
  preventScrollRestoration = false,
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  const handleOpen = React.useCallback(($open: boolean) => {
    if (!document) return;
    const body = document.body;

    if (!$open) {
      body.removeAttribute('data-drawer-open');
      return;
    }

    body.setAttribute('data-drawer-open', String($open));
  }, []);

  return (
    <DrawerPrimitive.Root
      onOpenChange={($open) => {
        onOpenChange?.($open);
        handleOpen($open);
      }}
      open={open}
      preventScrollRestoration={preventScrollRestoration}
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerNestedRoot = DrawerPrimitive.NestedRoot;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      className={cn('fixed inset-0 z-50 bg-black/80', className)}
      {...props}
    />
  );
}

function DrawerContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-3xl bg-background lg:rounded-none',
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted md:hidden" />
        {children}
        <DrawerClose
          className={cn(
            iconButtonClass,
            'absolute top-2 right-2 hidden lg:inline-flex',
          )}
        >
          <IconClose className="size-6" strokeWidth={2} />
          <span className="sr-only">Close</span>
        </DrawerClose>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn(
        'text-lg leading-none font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

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
