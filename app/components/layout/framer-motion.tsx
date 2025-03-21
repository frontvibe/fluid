import {LazyMotion} from 'framer-motion';

export function FramerMotion(props: {children: React.ReactNode}) {
  const loadFeatures = async () =>
    await import('../../lib/framer-motion-features.client').then(
      (res) => res.default,
    );

  return (
    <LazyMotion features={loadFeatures} strict>
      {props.children}
    </LazyMotion>
  );
}
