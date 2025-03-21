import {type HTMLMotionProps, m} from 'framer-motion';

import {useHydrated} from '~/hooks/use-hydrated';

/**
 * Renders a progressive motion div based on the hydration status.
 * Useful to render content when JS is disabled.
 */
export function ProgressiveMotionDiv({
  children,
  className,
  forceMotion,
  ...props
}: HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  forceMotion?: boolean;
}) {
  const isHydrated = useHydrated();

  return forceMotion || isHydrated ? (
    <m.div className={className} {...props}>
      {children}
    </m.div>
  ) : (
    <div className={className}>{children}</div>
  );
}
