import type {VariantProps} from 'class-variance-authority';

import {Label as LabelPrimitive} from 'radix-ui';
import {cn} from 'app/lib/utils';
import {cva} from 'class-variance-authority';

const labelVariants = cva(
  'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) {
  return (
    <LabelPrimitive.Root
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
}

export {Label};
