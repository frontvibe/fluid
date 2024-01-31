import {cn} from '~/lib/utils';

import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconChevron(
  props: {direction: 'down' | 'left' | 'right' | 'up'} & IconProps,
) {
  return (
    <Icon
      className={cn('size-5', props.className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <title>Chevron</title>
      {props.direction === 'down' && <path d="m6 9 6 6 6-6" />}
      {props.direction === 'up' && <path d="m18 15-6-6-6 6" />}
      {props.direction === 'left' && <path d="m15 18-6-6 6-6" />}
      {props.direction === 'right' && <path d="m9 18 6-6-6-6" />}
    </Icon>
  );
}
