import type {IconProps} from './Icon';

import {Icon} from './Icon';

export function IconClose(props: IconProps) {
  return (
    <Icon {...props} stroke={props.stroke || 'currentColor'}>
      <title>Close</title>
      <line x1="4.44194" x2="15.7556" y1="4.30806" y2="15.6218" />
      <line
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        x2="16"
        y1="-0.625"
        y2="-0.625"
      />
    </Icon>
  );
}
