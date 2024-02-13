import {type HTMLMotionProps, m} from 'framer-motion';

import {useIsHydrated} from '~/hooks/useIsHydrated';

/**
 * Renders a progressive motion div based on the hydration status.
 * Useful to render content when JS is disabled.
 */
export function ProgressiveMotionDiv({
  children,
  className,
  forceMotion,
  ...props
}: {
  children: React.ReactNode;
  forceMotion?: boolean;
} & HTMLMotionProps<'div'>) {
  const isHydrated = useIsHydrated();

  return forceMotion || isHydrated ? (
    <m.div className={className} {...props}>
      {children}
    </m.div>
  ) : (
    <div className={className}>{children}</div>
  );
}
