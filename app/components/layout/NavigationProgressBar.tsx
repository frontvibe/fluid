import {useNavigation} from '@remix-run/react';
import {useNProgress} from '@tanem/react-nprogress';

import {cn} from '~/lib/utils';

export function NavigationProgressBar() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== 'idle';
  const {animationDuration, isFinished, progress} = useNProgress({
    isAnimating: isLoading,
  });

  return (
    <div
      className={cn([isFinished ? 'opacity-0' : 'opacity-100'])}
      style={{
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      <div
        className="fixed left-0 top-0 z-[1042] h-[3px] w-full rounded-r-full bg-primary"
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
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
      </div>
    </div>
  );
}
