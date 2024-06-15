import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconAccount(props: IconProps) {
  return (
    <Icon
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <title>Account</title>
      <path
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
