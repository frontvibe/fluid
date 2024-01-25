import type {VariantProps} from 'class-variance-authority';

import {Slot} from '@radix-ui/react-slot';
import {cva} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '~/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded-md px-8',
        primitive: 'h-auto p-0',
        sm: 'h-9 rounded-md px-3',
      },
      variant: {
        default:
          'border border-color-scheme-primary-button-bg bg-color-scheme-primary-button-bg text-color-scheme-primary-button-label ring-color-scheme-primary-button-bg hover:bg-color-scheme-primary-button-bg/90 hover:border-color-scheme-primary-button-bg/90',
        destructive:
          'border border-red-800 bg-red-800 text-white hover:bg-red-800/90',
        ghost:
          'hover:bg-color-scheme-primary-button-bg hover:text-color-scheme-primary-button-label',
        link: 'text-color-scheme-primary-button-bg underline-offset-4 hover:underline',
        outline:
          'border border-color-scheme-outline-button ring-color-scheme-outline-button bg-color-scheme-bg text-color-scheme-outline-button hover:bg-color-scheme-outline-button hover:text-color-scheme-bg',
        primitive: '',
        secondary:
          'border border-color-scheme-text inverted-color-scheme ring-color-scheme-text hover:bg-color-scheme-text/90 hover:border-color-scheme-text/90',
        secondaryOutline:
          'border border-color-scheme-text ring-color-scheme-text bg-color-scheme-bg text-color-scheme-text hover:bg-color-scheme-text hover:text-color-scheme-bg',
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

export {Button, buttonVariants};
