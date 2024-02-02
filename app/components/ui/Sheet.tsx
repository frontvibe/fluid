import type {VariantProps} from 'class-variance-authority';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import {cva} from 'class-variance-authority';
import {forwardRef} from 'react';

import {cn} from '~/lib/utils';

import {IconClose} from '../icons/IconClose';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({className, ...props}, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  [
    'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out bottom-0 inset-x-0 md:bottom-auto md:inset-x-auto',
    'rounded-t-[2rem] md:rounded-none border md:border-none border-border overflow-hidden',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:duration-300 data-[state=open]:duration-500',
    'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
    'md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=open]:slide-in-from-bottom-0',
  ],
  {
    defaultVariants: {
      side: 'right',
    },
    variants: {
      side: {
        bottom:
          'md:inset-x-0 md:bottom-0 md:data-[state=closed]:slide-out-to-bottom md:data-[state=open]:slide-in-from-bottom',
        left: 'md:inset-y-0 md:left-0 md:h-full w-3/4 md:data-[state=closed]:slide-out-to-left md:data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'md:inset-y-0 md:right-0 md:h-full w-3/4 md:data-[state=closed]:slide-out-to-right md:data-[state=open]:slide-in-from-right sm:max-w-sm',
        top: 'md:inset-x-0 md:top-0 md:data-[state=closed]:slide-out-to-top md:data-[state=open]:slide-in-from-top',
      },
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({children, className, side = 'right', ...props}, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      className={cn(sheetVariants({side}), className)}
      ref={ref}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 hidden rounded-sm ring-offset-background transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary md:block">
        <IconClose className="size-6" strokeWidth={2} />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({className, ...props}, ref) => (
  <SheetPrimitive.Title
    className={cn('text-lg font-semibold text-foreground', className)}
    ref={ref}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({className, ...props}, ref) => (
  <SheetPrimitive.Description
    className={cn('text-sm text-muted-foreground', className)}
    ref={ref}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
