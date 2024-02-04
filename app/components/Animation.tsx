import type {HTMLMotionProps} from 'framer-motion';

import {m} from 'framer-motion';

export function Animation(
  props: HTMLMotionProps<'div'> & {
    children: React.ReactNode;
    className?: string;
    enabled?: boolean | null;
  },
) {
  return props.enabled ? (
    <m.div className={props.className} {...props}>
      {props.children}
    </m.div>
  ) : (
    <div className={props.className}>{props.children}</div>
  );
}
