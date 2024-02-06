import {useNavigation} from '@remix-run/react';
import {useNProgress} from '@tanem/react-nprogress';
import {AnimatePresence, m} from 'framer-motion';

export function NavigationProgressBar() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== 'idle';
  const {animationDuration, isFinished, progress} = useNProgress({
    isAnimating: isLoading,
  });

  return (
    <AnimatePresence>
      {!isFinished && (
        <m.div
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          initial={{opacity: 0}}
          transition={{
            delay: 0.15,
            duration: animationDuration / 1000,
          }}
        >
          <m.div
            animate={{
              marginLeft: `${(-1 + progress) * 100}%`,
              transition: {
                duration: animationDuration / 1000,
                ease: 'linear',
              },
            }}
            className="fixed left-0 top-0 z-[1042] h-[3px] w-full rounded-r-full bg-primary"
          >
            <div
              className="absolute right-0 block h-full w-[100px] translate-y-[-4px] rotate-3 opacity-100"
              style={{
                boxShadow:
                  '0 0 10px rgb(var(--primary)), 0 0 5px rgb(var(--primary))',
              }}
            />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
