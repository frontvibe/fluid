import * as React from 'react';

import {IconMenu} from '../icons/icon-menu';
import {IconButton} from '../ui/button';

export const MobileNavigationTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <IconButton
      ref={ref}
      className="-mr-2 lg:mr-0 lg:hidden pointer-coarse:block"
      {...props}
    >
      <span className="sr-only">Menu</span>
      <IconMenu className="size-7" strokeWidth={1.5} />
    </IconButton>
  );
});

MobileNavigationTrigger.displayName = 'MobileNavigationTrigger';
