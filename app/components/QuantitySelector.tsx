import {cx} from 'class-variance-authority';
import {forwardRef} from 'react';

import {cn} from '~/lib/utils';

import type {ButtonProps} from './ui/Button';

import {IconButton} from './ui/Button';
export function QuantitySelector(props: {children: React.ReactNode}) {
  return (
    <div className="flex items-center border-border">{props.children}</div>
  );
}

const QuantityButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    symbol: 'decrease' | 'increase';
  }
>(({className, symbol, variant, ...props}, ref) => {
  return (
    <IconButton
      aria-label={cx([
        symbol === 'decrease' && 'Decrease quantity',
        symbol === 'increase' && 'Increase quantity',
      ])}
      className={cn([
        'group rounded border disabled:opacity-100',
        symbol === 'decrease'
          ? 'rounded-br-none rounded-tr-none border-r-0'
          : 'rounded-bl-none rounded-tl-none border-l-0',
        className,
      ])}
      name={cx([
        symbol === 'decrease' && 'decrease-quantity',
        symbol === 'increase' && 'increase-quantity',
      ])}
      ref={ref}
      {...props}
    >
      <span className="group-disabled:opacity-40">
        {
          {
            decrease: <>&#8722;</>,
            increase: <>&#43;</>,
          }[symbol]
        }
      </span>
      {props.children}
    </IconButton>
  );
});
QuantityButton.displayName = 'QuantityButton';

function Value(props: {children: React.ReactNode}) {
  return (
    <div className="flex h-full min-w-[2.5rem] select-none items-center justify-center border-y px-2 text-center">
      {props.children}
    </div>
  );
}

QuantitySelector.Button = QuantityButton;
QuantitySelector.Value = Value;
