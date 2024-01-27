import type {VariantProps} from 'class-variance-authority';

import {cva} from 'class-variance-authority';

export type HeaderVariantsProps = VariantProps<typeof header>;

export const header = cva([''], {
  variants: {
    optional: {'separator-line': 'border-foreground/10 border-b'},
  },
});

export const headerVariants = (props: HeaderVariantsProps) => header(props);
