import {ShopifyProvider} from '@shopify/hydrogen-react';
import {Suspense, lazy} from 'react';

import {useEnvironmentVariables} from '~/hooks/useEnvironmentVariables';
import {useLocale} from '~/hooks/useLocale';
import {useSanityPreviewMode} from '~/hooks/useSanityPreviewMode';

import {TailwindIndicator} from '../TailwindIndicator';
import {TogglePreviewMode} from '../sanity/TogglePreviewMode';
import {AnnouncementBar} from './AnnoucementBar';
import {Footer} from './Footer';
import {FramerMotion} from './FramerMotion';
import {Header} from './Header';
import {NavigationProgressBar} from './NavigationProgressBar';

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
  const env = useEnvironmentVariables();
  const locale = useLocale();

  return (
    <ShopifyProvider
      countryIsoCode={locale?.country || 'US'}
      languageIsoCode={locale?.language || 'EN'}
      storeDomain={env?.PUBLIC_STORE_DOMAIN!}
      storefrontApiVersion={env?.PUBLIC_STOREFRONT_API_VERSION!}
      storefrontToken={env?.PUBLIC_STOREFRONT_API_TOKEN!}
    >
      <FramerMotion>
        <NavigationProgressBar />
        <AnnouncementBar />
        <Header />
        <main className="flex grow flex-col gap-y-[calc(var(--space-between-template-sections)*.75)] sm:gap-y-[--space-between-template-sections]">
          {children}
        </main>
        <Footer />
        <TailwindIndicator />
        {previewMode ? (
          <Suspense>
            <VisualEditing />
          </Suspense>
        ) : (
          <TogglePreviewMode />
        )}
      </FramerMotion>
    </ShopifyProvider>
  );
}
