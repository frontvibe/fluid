import {Popover as PopoverPrimitive} from 'radix-ui';
import {cn} from 'app/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

function PopoverContent({
  align = 'center',
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        className={cn(
          'z-50 w-72 rounded-md bg-popover p-4 text-popover-foreground outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'rounded-(--dropdown-popup-border-corner-radius)',
          '[border-width:var(--dropdown-popup-border-thickness)] border-[rgb(var(--border)_/_var(--dropdown-popup-border-opacity))]',
          '[box-shadow:rgb(var(--shadow)_/_var(--dropdown-popup-shadow-opacity))_var(--dropdown-popup-shadow-horizontal-offset)_var(--dropdown-popup-shadow-vertical-offset)_var(--dropdown-popup-shadow-blur-radius)_0px]',
          className,
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export {Popover, PopoverContent, PopoverTrigger};
