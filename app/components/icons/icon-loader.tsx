import type {IconProps} from '.';

import {Icon} from '.';

export function IconLoader(props: IconProps) {
  return (
    <Icon
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      {...props}
    >
      <title>Loader</title>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </Icon>
  );
}
