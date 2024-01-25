import {Suspense, lazy} from 'react';

import {useSanityPreviewMode} from '~/hooks/useSanityPreviewMode';

import {TailwindIndicator} from '../TailwindIndicator';
import {TogglePreviewMode} from '../sanity/TogglePreviewMode';
import {Footer} from './Footer';
import {Header} from './Header';

const VisualEditing = lazy(() =>
  import('~/components/sanity/VisualEditing').then((mod) => ({
    default: mod.VisualEditing,
  })),
);

export type LayoutProps = {
  children?: React.ReactNode;
};

export function Layout({children = null}: LayoutProps) {
  const previewMode = useSanityPreviewMode();

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <TailwindIndicator />
      {previewMode ? (
        <Suspense>
          <VisualEditing />
        </Suspense>
      ) : (
        <TogglePreviewMode />
      )}
    </>
  );
}
