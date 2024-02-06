import {useNavigation} from '@remix-run/react';
import {useNProgress} from '@tanem/react-nprogress';
import {AnimatePresence, m} from 'framer-motion';
import {useEffect, useState} from 'react';

export function NavigationProgressBar() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {animationDuration, isFinished, progress} = useNProgress({
    isAnimating: isLoading,
  });
  const delay = 300;

  // Delay the progress bar apparing to avoid flickering when the page loads quickly
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(navigation.state !== 'idle');
    }, delay);

    return () => clearTimeout(timeout);
  }, [navigation.state]);

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  );
}

function Container(props: {
  animationDuration: number;
  children: React.ReactNode;
  isFinished: boolean;
}) {
  const {animationDuration, children, isFinished} = props;

  return (
    <AnimatePresence>
      {!isFinished && (
        <m.div
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          initial={{opacity: 0}}
          transition={{
            duration: animationDuration / 1000,
          }}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}

function Bar(props: {animationDuration: number; progress: number}) {
  const {animationDuration, progress} = props;
  const marginLeft = `${(-1 + progress) * 100}%`;

  return (
    <m.div
      aria-hidden
      className="fixed left-0 top-0 z-[1041] h-[3px] w-full rounded-r-full bg-primary"
      style={{
        marginLeft,
        transition: `margin-left ${animationDuration}ms linear`,
      }}
    >
      <div
        className="absolute right-0 block h-full w-[100px] translate-y-[-4px] rotate-3 opacity-100"
        style={{
          boxShadow:
            '0 0 10px rgb(var(--primary)), 0 0 5px rgb(var(--primary))',
        }}
      />
    </m.div>
  );
}
