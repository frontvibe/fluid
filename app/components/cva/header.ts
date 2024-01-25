import type {VariantProps} from 'class-variance-authority';

import {cva} from 'class-variance-authority';

export type HeaderVariantsProps = VariantProps<typeof header>;

export const header = cva([''], {
  variants: {
    optional: {'separator-line': 'border-color-scheme-text/10 border-b'},
  },
});

export const headerVariants = (props: HeaderVariantsProps) => header(props);
