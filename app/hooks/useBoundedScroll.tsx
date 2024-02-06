import {useMotionValue, useScroll, useTransform} from 'framer-motion';
import {useCallback, useEffect} from 'react';
import {useLocation} from 'react-use';

export function useBoundedScroll(threshold: number) {
  const {scrollY, scrollYProgress} = useScroll();
  const {pathname} = useLocation();
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, threshold],
    [0, 1],
  );

  const handleChangePathname = useCallback(() => {
    scrollYBounded.set(scrollYProgress.get());
  }, [scrollYProgress, scrollYBounded]);

  useEffect(() => {
    // Set the bounded scroll to the current scroll position when the pathname changes
    handleChangePathname();
  }, [pathname, handleChangePathname]);

  useEffect(() => {
    return scrollY.on('change', (current) => {
      const body = document.body;
      if (body.getAttribute('data-drawer-open') === 'true') return;

      if (scrollYProgress.get() >= 0.95) {
        // Reached the bottom of the page, so we don't want to bound the scroll
        return;
      }

      const previous = scrollY.getPrevious() ?? 0;
      const diff = current - previous;
      const newScrollYBounded = scrollYBounded.get() + diff;

      scrollYBounded.set(clamp(newScrollYBounded, 0, threshold));
    });
  }, [threshold, scrollY, scrollYBounded, scrollYProgress]);

  return {scrollYBounded, scrollYBoundedProgress};
}

const clamp = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max);
