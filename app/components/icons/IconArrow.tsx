import {cn} from '~/lib/utils';

import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconArrow(
  props: {direction: 'down' | 'left' | 'right' | 'up'} & IconProps,
) {
  let rotate;

  switch (props.direction) {
    case 'right':
      rotate = 'rotate-0';
      break;
    case 'left':
      rotate = 'rotate-180';
      break;
    case 'up':
      rotate = '-rotate-90';
      break;
    case 'down':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon
      className={cn('size-5', props.className, rotate)}
      fill="none"
      stroke="currentColor"
    >
      <title>Arrow</title>
      <path d="M7 3L14 10L7 17" strokeWidth="1.25" />
    </Icon>
  );
}
