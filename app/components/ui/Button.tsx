import type {VariantProps} from 'class-variance-authority';

import {Slot} from '@radix-ui/react-slot';
import {cva} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '~/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center select-none justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'size-11',
        lg: 'h-11 rounded-md px-8',
        primitive: 'h-auto p-0',
        sm: 'h-9 rounded-md px-3',
      },
      variant: {
        default:
          'bg-primary text-primary-foreground notouch:hover:bg-primary/90 hover:active:bg-primary/80',
        destructive:
          'bg-destructive text-destructive-foreground notouch:hover:bg-destructive/90 hover:active:bg-destructive/80',
        ghost:
          'notouch:hover:bg-accent/55 notouch:hover:text-accent-foreground hover:active:bg-accent active:text-accent-foreground',
        link: 'text-primary underline-offset-4 notouch:hover:underline touch:active:underline',
        outline:
          'border border-input bg-background notouch:hover:bg-accent/55 hover:active:bg-accent notouch:hover:text-accent-foreground active:text-accent-foreground',
        primitive: '',
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
