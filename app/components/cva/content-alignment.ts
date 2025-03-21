import type {VariantProps} from 'class-variance-authority';

import {cva} from 'class-variance-authority';

/*
|--------------------------------------------------------------------------
| Content Alignment
|--------------------------------------------------------------------------
*/
export type ContentPositionVariantProps = VariantProps<typeof contentPosition>;

export const contentPosition = cva('flex h-full', {
  variants: {
    required: {
      bottom_center: 'items-end justify-center',
      bottom_left: 'items-end justify-start',
      bottom_right: 'items-end justify-end',
      middle_center: 'items-center justify-center',
      middle_left: 'items-center justify-start',
      middle_right: 'items-center justify-end',
      top_center: 'items-start justify-center',
      top_left: 'items-start justify-start',
      top_right: 'items-start justify-end',
    },
  },
});

export const contentPositionVariants = (props: ContentPositionVariantProps) =>
  contentPosition(props);

/*
|--------------------------------------------------------------------------
| Text Alignment
|--------------------------------------------------------------------------
*/
export type ContentAlignmentVariantProps = VariantProps<
  typeof contentAlignment
>;

export const contentAlignment = cva('', {
  variants: {
    required: {
      center: 'text-center',
      left: 'text-left',
      right: 'text-right',
    },
  },
});

export const contentAlignmentVariants = (props: ContentAlignmentVariantProps) =>
  contentAlignment(props);
