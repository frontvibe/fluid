import {ShopifyProvider} from '@shopify/hydrogen-react';
import {Suspense} from 'react';

import {useRootLoaderData} from '~/root';

import {ClientOnly} from '../client-only';
import {TogglePreviewMode} from '../sanity/toggle-preview-mode';
import {VisualEditing} from '../sanity/visual-editing.client';
import {TailwindIndicator} from '../tailwind-indicator';
import {AnnouncementBar} from './announcement-bar';
import {Footer} from './footer';
import {Motion} from './motion';
import {Header} from './header';
import {NavigationProgressBar} from './navigation-progress-bar.client';

export type LayoutProps = {
  children?: React.ReactNode;
};

export function AppLayout({children = null}: LayoutProps) {
  const {env, locale, sanityPreviewMode} = useRootLoaderData();

  return (
    <ShopifyProvider
      countryIsoCode={locale.country || 'US'}
      languageIsoCode={locale.language || 'EN'}
      storeDomain={env.PUBLIC_STORE_DOMAIN}
      storefrontApiVersion={env.PUBLIC_STOREFRONT_API_VERSION}
      storefrontToken={env.PUBLIC_STOREFRONT_API_TOKEN}
    >
      <Motion>
        <ClientOnly fallback={null}>
          {() => <NavigationProgressBar />}
        </ClientOnly>
        <AnnouncementBar />
        <Header />
        <main className="flex min-h-[90vh] grow flex-col gap-y-[calc(var(--space-between-template-sections)*.75)] sm:gap-y-(--space-between-template-sections)">
          {children}
        </main>
        <Footer />
        <TailwindIndicator />
        {sanityPreviewMode ? (
          <ClientOnly fallback={null}>
            {() => (
              <Suspense>
                <VisualEditing />
              </Suspense>
            )}
          </ClientOnly>
        ) : (
          <TogglePreviewMode />
        )}
      </Motion>
    </ShopifyProvider>
  );
}
