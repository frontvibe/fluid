import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconBag(props: IconProps) {
  return (
    <Icon {...props}>
      <title>Bag</title>
      <path
        d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
        fillRule="evenodd"
      />
    </Icon>
  );
}
