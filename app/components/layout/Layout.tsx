import {ShopifyProvider} from '@shopify/hydrogen-react';

import {useRootLoaderData} from '~/root';

import {TogglePreviewMode} from '../sanity/TogglePreviewMode';
import {VisualEditing} from '../sanity/VisualEditing';
import {TailwindIndicator} from '../TailwindIndicator';
import {AnnouncementBar} from './AnnouncementBar';
import {Footer} from './Footer';
import {FramerMotion} from './FramerMotion';
import {Header} from './Header';
import {NavigationProgressBar} from './NavigationProgressBar';

export type LayoutProps = {
  children?: React.ReactNode;
};

export function Layout({children = null}: LayoutProps) {
  const {env, locale, sanityPreviewMode} = useRootLoaderData();

  return (
    <ShopifyProvider
      countryIsoCode={locale.country || 'US'}
      languageIsoCode={locale.language || 'EN'}
      storeDomain={env.PUBLIC_STORE_DOMAIN}
      storefrontApiVersion={env.PUBLIC_STOREFRONT_API_VERSION}
      storefrontToken={env.PUBLIC_STOREFRONT_API_TOKEN}
    >
      <FramerMotion>
        <NavigationProgressBar />
        <AnnouncementBar />
        <Header />
        <main className="flex min-h-[90vh] grow flex-col gap-y-[calc(var(--space-between-template-sections)*.75)] sm:gap-y-[--space-between-template-sections]">
          {children}
        </main>
        <Footer />
        <TailwindIndicator />
        {sanityPreviewMode ? <VisualEditing /> : <TogglePreviewMode />}
      </FramerMotion>
    </ShopifyProvider>
  );
}
