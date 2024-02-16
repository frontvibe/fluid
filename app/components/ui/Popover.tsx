import * as PopoverPrimitive from '@radix-ui/react-popover';
import {cn} from 'app/lib/utils';
import {forwardRef} from 'react';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({align = 'center', className, sideOffset = 4, ...props}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align={align}
      className={cn(
        'z-50 w-72 rounded-md bg-popover p-4 text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        'rounded-[--dropdown-popup-border-corner-radius]',
        'border-[rgb(var(--border)_/_var(--dropdown-popup-border-opacity))] [border-width:--dropdown-popup-border-thickness]',
        '[box-shadow:rgb(var(--shadow)_/_var(--dropdown-popup-shadow-opacity))_var(--dropdown-popup-shadow-horizontal-offset)_var(--dropdown-popup-shadow-vertical-offset)_var(--dropdown-popup-shadow-blur-radius)_0px]',
        className,
      )}
      ref={ref}
      sideOffset={sideOffset}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export {Popover, PopoverContent, PopoverTrigger};
