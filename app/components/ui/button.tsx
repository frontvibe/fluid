import type {VariantProps} from 'class-variance-authority';

import {Slot as SlotPrimitive} from 'radix-ui';
import {cva} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '~/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center font-semibold whitespace-nowrap ring-offset-background transition select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
    'rounded-(--button-border-corner-radius)',
    '[box-shadow:rgb(var(--shadow)_/_var(--button-shadow-opacity))_var(--button-shadow-horizontal-offset)_var(--button-shadow-vertical-offset)_var(--button-shadow-blur-radius)_0px]',
  ],
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-11 px-4 py-2',
        icon: 'touch-hitbox size-9',
        lg: 'h-12 rounded-md px-8',
        primitive: 'h-auto p-0',
        sm: 'h-9 rounded-md px-3',
      },
      variant: {
        default:
          'bg-primary text-primary-foreground hover:active:bg-primary/80 pointer-fine:hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:active:bg-destructive/80 pointer-fine:hover:bg-destructive/90',
        ghost:
          'shadow-none [box-shadow:0_0_#0000] active:text-accent-foreground hover:active:bg-accent pointer-fine:hover:bg-accent/55 pointer-fine:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [box-shadow:0_0_#0000] pointer-coarse:active:underline pointer-fine:hover:underline',
        outline: [
          'bg-background active:text-accent-foreground hover:active:bg-accent pointer-fine:hover:bg-accent/55 pointer-fine:hover:text-accent-foreground',
          '[border-width:var(--button-border-thickness)] border-[rgb(var(--input)_/_var(--button-border-opacity))]',
        ],
        primitive: '[box-shadow:0_0_#0000]',
        secondary:
          'bg-secondary text-secondary-foreground hover:active:bg-secondary/30 pointer-fine:hover:bg-secondary/55',
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({asChild = false, className, size, variant, ...props}, ref) => {
    const Comp = asChild ? SlotPrimitive.Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({className, size, variant}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const iconButtonClass = buttonVariants({size: 'icon', variant: 'ghost'});

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({asChild = false, className, ...props}, ref) => {
    const Comp = asChild ? SlotPrimitive.Slot : 'button';
    return (
      <Comp className={cn(iconButtonClass, className)} ref={ref} {...props} />
    );
  },
);
IconButton.displayName = 'IconButton';

export {Button, buttonVariants, IconButton};
