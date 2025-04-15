import {LazyMotion} from 'motion/react';

export function Motion(props: {children: React.ReactNode}) {
  const loadFeatures = async () =>
    await import('../../lib/motion-features.client').then((res) => res.default);

  return (
    <LazyMotion features={loadFeatures} strict>
      {props.children}
    </LazyMotion>
  );
}
