import {useScroll} from 'framer-motion';
import {useCallback, useEffect, useState} from 'react';

export function useScrollDirection() {
  const {scrollY, scrollYProgress} = useScroll();
  const [direction, setDirection] = useState<'down' | 'up' | null>(null);

  const setDirectionCallback = useCallback(
    (current: number) => {
      const previous = scrollY.getPrevious() ?? 0;
      const diff = current - previous;

      if (scrollYProgress.get() >= 0.965 || diff < 0) {
        setDirection('up');
      } else if (diff > 0 && scrollYProgress.get() > 0.025) {
        setDirection('down');
      }
    },
    [scrollY, scrollYProgress],
  );

  useEffect(() => {
    const unsubscribe = scrollY.on('change', setDirectionCallback);

    return () => {
      unsubscribe();
    };
  }, [scrollY, setDirectionCallback]);

  return {direction};
}

const clamp = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max);
