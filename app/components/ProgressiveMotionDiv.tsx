import {type HTMLMotionProps, m} from 'framer-motion';

import {useIsHydrated} from '~/hooks/useIsHydrated';

/**
 * Renders a progressive motion div based on the hydration status.
 * Useful to render content when JS is disabled.
 */
export function ProgressiveMotionDiv({
  children,
  className,
  ...props
}: {children: React.ReactNode} & HTMLMotionProps<'div'>) {
  const isHydrated = useIsHydrated();
  return isHydrated ? (
    <m.div className={className} {...props}>
      {children}
    </m.div>
  ) : (
    <div className={className}>{children}</div>
  );
}
