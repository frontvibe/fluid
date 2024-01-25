import type {HTMLMotionProps} from 'framer-motion';

import {LazyMotion, m} from 'framer-motion';

export function Animation(
  props: HTMLMotionProps<'div'> & {
    children: React.ReactNode;
    className?: string;
    enabled?: boolean | null;
  },
) {
  const loadFeatures = async () =>
    await import('../lib/framerMotionFeatures').then((res) => res.default);

  return props.enabled ? (
    <LazyMotion features={loadFeatures} strict>
      <m.div className={props.className} {...props}>
        {props.children}
      </m.div>
    </LazyMotion>
  ) : (
    <div className={props.className}>{props.children}</div>
  );
}
