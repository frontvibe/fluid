import {cx} from 'class-variance-authority';
import {forwardRef} from 'react';

import {cn} from '~/lib/utils';

import type {ButtonProps} from './ui/Button';

import {Button} from './ui/Button';
export function QuantitySelector(props: {children: React.ReactNode}) {
  return (
    <div className="flex items-center overflow-hidden rounded border border-border">
      {props.children}
    </div>
  );
}

const QuantityButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    symbol: 'decrease' | 'increase';
  }
>(({className, symbol, variant, ...props}, ref) => {
  return (
    <Button
      aria-label={cx([
        symbol === 'decrease' && 'Decrease quantity',
        symbol === 'increase' && 'Increase quantity',
      ])}
      className={cn(['rounded-none disabled:opacity-30', className])}
      name={cx([
        symbol === 'decrease' && 'decrease-quantity',
        symbol === 'increase' && 'increase-quantity',
      ])}
      ref={ref}
      variant="ghost"
      {...props}
    >
      <span>
        {
          {
            decrease: <>&#8722;</>,
            increase: <>&#43;</>,
          }[symbol]
        }
      </span>
      {props.children}
    </Button>
  );
});
QuantityButton.displayName = 'QuantityButton';

function Value(props: {children: React.ReactNode}) {
  return (
    <div className="min-w-[2.5rem] select-none px-2 text-center">
      {props.children}
    </div>
  );
}

QuantitySelector.Button = QuantityButton;
QuantitySelector.Value = Value;
