import {cn} from '~/lib/utils';

import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconSort(props: IconProps) {
  return (
    <Icon
      className={cn('size-5', props.className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <title>Sort</title>

      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </Icon>
  );
}
