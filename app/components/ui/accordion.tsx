import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {forwardRef} from 'react';

import {cn} from '~/lib/utils';

import {IconChevron} from '../icons/icon-chevron';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({className, ...props}, ref) => (
  <AccordionPrimitive.Item
    className={cn('border-b', className)}
    ref={ref}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({children, className, ...props}, ref) => (
  <AccordionPrimitive.Header asChild className="flex">
    <div>
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
        <IconChevron
          className="size-3 shrink-0 transition-transform duration-200 group-data-[state='open']:rotate-[180deg]"
          direction="down"
        />
      </AccordionPrimitive.Trigger>
    </div>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({children, className, ...props}, ref) => (
  <AccordionPrimitive.Content
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all"
    ref={ref}
    {...props}
  >
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {Accordion, AccordionContent, AccordionItem, AccordionTrigger};
