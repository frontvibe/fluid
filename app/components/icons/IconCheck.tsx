import {cn} from '~/lib/utils';

import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconCheck(props: IconProps) {
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
      <title>Check</title>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}
