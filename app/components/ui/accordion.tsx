import {Accordion as AccordionPrimitive} from 'radix-ui';

import {cn} from '~/lib/utils';

import {IconChevron} from '../icons/icon-chevron';

const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item className={cn('border-b', className)} {...props} />
  );
}

function AccordionTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header asChild className="flex">
      <div>
        <AccordionPrimitive.Trigger
          className={cn(
            'group flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
            className,
          )}
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
  );
}

function AccordionContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export {Accordion, AccordionContent, AccordionItem, AccordionTrigger};
