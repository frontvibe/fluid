import type {VariantProps} from 'class-variance-authority';

import {Slot} from '@radix-ui/react-slot';
import {cva, cx} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '~/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center font-semibold select-none justify-center whitespace-nowrap ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    'rounded-[--button-border-corner-radius]',
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
        icon: 'size-11',
        lg: 'h-12 rounded-md px-8',
        primitive: 'h-auto p-0',
        sm: 'h-9 rounded-md px-3',
      },
      variant: {
        default:
          'bg-primary text-primary-foreground notouch:hover:bg-primary/90 hover:active:bg-primary/80',
        destructive:
          'bg-destructive text-destructive-foreground notouch:hover:bg-destructive/90 hover:active:bg-destructive/80',
        ghost:
          'notouch:hover:bg-accent/55 shadow-none notouch:hover:text-accent-foreground hover:active:bg-accent active:text-accent-foreground [box-shadow:0_0_#0000]',
        link: 'text-primary underline-offset-4 notouch:hover:underline touch:active:underline [box-shadow:0_0_#0000]',
        outline: [
          'bg-background notouch:hover:bg-accent/55 hover:active:bg-accent notouch:hover:text-accent-foreground active:text-accent-foreground',
          '[border-width:--button-border-thickness] border-[rgb(var(--input)_/_var(--button-border-opacity))]',
        ],
        primitive: '[box-shadow:0_0_#0000]',
        secondary:
          'bg-secondary text-secondary-foreground notouch:hover:bg-secondary/55 hover:active:bg-secondary/30',
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
    const Comp = asChild ? Slot : 'button';
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
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(iconButtonClass, className)} ref={ref} {...props} />
    );
  },
);
IconButton.displayName = 'IconButton';

export {Button, IconButton, buttonVariants};
