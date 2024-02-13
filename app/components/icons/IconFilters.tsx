import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconFilters(props: IconProps) {
  return (
    <Icon
      {...props}
      fill="transparent"
      stroke={props.stroke || 'currentColor'}
      viewBox="0 0 14 14"
    >
      <title>Filters</title>
      <g clipPath="url(#clip0_1_2)">
        <path d="M6 3.5H14M0 3.5H3M0 10.5H8M11 10.5H14M6.5 3.5C6.5 4.60457 5.60457 5.5 4.5 5.5C3.39543 5.5 2.5 4.60457 2.5 3.5C2.5 2.39543 3.39543 1.5 4.5 1.5C5.60457 1.5 6.5 2.39543 6.5 3.5ZM11.5 10.5C11.5 11.6046 10.6046 12.5 9.5 12.5C8.39543 12.5 7.5 11.6046 7.5 10.5C7.5 9.39543 8.39543 8.5 9.5 8.5C10.6046 8.5 11.5 9.39543 11.5 10.5Z" />
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <rect height="16" transform="translate(0 -3)" width="16" />
        </clipPath>
      </defs>
    </Icon>
  );
}
