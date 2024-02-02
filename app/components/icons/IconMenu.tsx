import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconMenu(props: IconProps) {
  return (
    <Icon {...props} stroke={props.stroke || 'currentColor'}>
      <title>Menu</title>
      <line strokeWidth="1.25" x1="3" x2="17" y1="6.375" y2="6.375" />
      <line strokeWidth="1.25" x1="3" x2="17" y1="10.375" y2="10.375" />
      <line strokeWidth="1.25" x1="3" x2="17" y1="14.375" y2="14.375" />
    </Icon>
  );
}
