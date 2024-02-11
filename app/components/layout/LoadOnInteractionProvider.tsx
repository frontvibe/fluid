import {createContext, useCallback, useEffect, useState} from 'react';
import {useFirstMountState} from 'react-use';

type LoadOnInteractionContext = {
  ready: boolean;
};

export const LoadOnInteractionContext =
  createContext<LoadOnInteractionContext | null>(null);

export function LoadOnInteractionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const isFirstRender = useFirstMountState();

  const handleReady = useCallback(() => {
    if (!ready) {
      setReady(true);
      console.log('ready');

      window.removeEventListener('scroll', handleReady);
      window.removeEventListener('mousemove', handleReady);
      window.removeEventListener('touchstart', handleReady);
      window.removeEventListener('keypress', handleReady);
    }
  }, [ready]);

  useEffect(() => {
    console.log(isFirstRender);

    if (isFirstRender) {
      window.addEventListener('scroll', handleReady);
      window.addEventListener('mousemove', handleReady);
      window.addEventListener('touchstart', handleReady);
      window.addEventListener('keypress', handleReady);
    }

    return () => {
      window.removeEventListener('scroll', handleReady);
      window.removeEventListener('mousemove', handleReady);
      window.removeEventListener('touchstart', handleReady);
      window.removeEventListener('keypress', handleReady);
    };
  }, [handleReady, isFirstRender]);

  return (
    <LoadOnInteractionContext.Provider value={{ready}}>
      {children}
    </LoadOnInteractionContext.Provider>
  );
}
