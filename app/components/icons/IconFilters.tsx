import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconFilters(props: IconProps) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
      <title>Filters</title>
      <circle cx="4.5" cy="6.5" r="2" />
      <line x1="6" x2="14" y1="6.5" y2="6.5" />
      <line x1="4.37114e-08" x2="3" y1="6.5" y2="6.5" />
      <line x1="4.37114e-08" x2="8" y1="13.5" y2="13.5" />
      <line x1="11" x2="14" y1="13.5" y2="13.5" />
      <circle cx="9.5" cy="13.5" r="2" />
    </Icon>
  );
}
