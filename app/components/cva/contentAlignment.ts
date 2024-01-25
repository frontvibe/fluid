import type {VariantProps} from 'class-variance-authority';

import {cva} from 'class-variance-authority';

/*
|--------------------------------------------------------------------------
| Content Alignment
|--------------------------------------------------------------------------
*/
export type ContentAlignmentVariantProps = VariantProps<
  typeof contentAlignment
>;

export const contentAlignment = cva('flex h-full', {
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

export const contentAlignmentVariants = (props: ContentAlignmentVariantProps) =>
  contentAlignment(props);

/*
|--------------------------------------------------------------------------
| Text Alignment
|--------------------------------------------------------------------------
*/
export type TextAlignmentVariantProps = VariantProps<typeof textAlignment>;

export const textAlignment = cva('', {
  variants: {
    required: {
      center: 'text-center',
      left: 'text-left',
      right: 'text-right',
    },
  },
});

export const textAlignmentVariants = (props: TextAlignmentVariantProps) =>
  textAlignment(props);

/*
|--------------------------------------------------------------------------
| Content Position
|--------------------------------------------------------------------------
*/
export type ContentPositionVariantProps = VariantProps<typeof contentPosition>;

export const contentPosition = cva('', {
  variants: {
    required: {
      center: 'mx-auto',
      left: 'mr-auto',
      right: 'ml-auto',
    },
  },
});

export const contentPositionVariants = (props: ContentPositionVariantProps) =>
  contentPosition(props);
