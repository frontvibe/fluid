import {useMotionValue, useScroll, useTransform} from 'framer-motion';
import {useEffect} from 'react';

export function useBoundedScroll(threshold: number) {
  const {scrollY, scrollYProgress} = useScroll();
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, threshold],
    [0, 1],
  );

  useEffect(() => {
    return scrollY.on('change', (current) => {
      const body = document.body;
      if (body.getAttribute('data-drawer-open') === 'true') return;

      // Reached the bottom of the page, so we don't want to bound the scroll
      if (scrollYProgress.get() >= 0.95) return;

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
