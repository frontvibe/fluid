import {cn} from '~/lib/utils';

import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconCircle(props: IconProps) {
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
      <title>Circle</title>
      <circle cx="12" cy="12" r="10" />
    </Icon>
  );
}
