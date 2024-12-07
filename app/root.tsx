import type {ShouldRevalidateFunction} from '@remix-run/react';
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@shopify/remix-oxygen';

import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useMatches,
  useNavigate,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react';
import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {DEFAULT_LOCALE} from 'countries';

import {Layout as AppLayout} from '~/components/layout/Layout';

import {CssVars} from './components/CssVars';
import {CustomAnalytics} from './components/CustomAnalytics';
import {Fonts} from './components/Fonts';
import {generateSanityImageUrl} from './components/sanity/SanityImage';
import {Button} from './components/ui/Button';
import {useLocalePath} from './hooks/useLocalePath';
import {useSanityThemeContent} from './hooks/useSanityThemeContent';
import {generateFontsPreloadLinks} from './lib/fonts';
import {resolveShopifyPromises} from './lib/resolveShopifyPromises';
import {seoPayload} from './lib/seo.server';
import {ROOT_QUERY} from './qroq/queries';
import tailwindCss from './styles/tailwind.css?url';

import faviconAsset from '/favicon.ico?url';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

export const links: LinksFunction = () => {
  return [
    {
      href: 'https://cdn.shopify.com',
      rel: 'preconnect',
    },
    {
      href: 'https://shop.app',
      rel: 'preconnect',
    },
    {href: tailwindCss, rel: 'stylesheet'},
  ];
};

export const meta: MetaFunction<RootLoader> = (loaderData) => {
  const {data} = loaderData;
  // Preload fonts files to avoid FOUT (flash of unstyled text)
  const fontsPreloadLinks = generateFontsPreloadLinks({
    fontsData: data?.sanityRoot.data?.fonts,
  });

  const faviconUrls = data ? generateFaviconUrls(data) : [];

  return [
    {
      // Preconnect to the Sanity CDN before loading fonts
      href: 'https://cdn.sanity.io',
      rel: 'preconnect',
      tagName: 'link',
    },
    ...faviconUrls,
    ...fontsPreloadLinks,
  ];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {
    cart,
    customerAccount,
    env,
    locale,
    sanity,
    sanityPreviewMode,
    storefront,
  } = context;
  const language = locale?.language.toLowerCase();
  const isLoggedInPromise = customerAccount.isLoggedIn();

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
  };

  const rootData = Promise.all([
    sanity.query({
      groqdQuery: ROOT_QUERY,
      params: queryParams,
    }),
    storefront.query(`#graphql
      query layout {
        shop {
          id
        } 
      }
    `),
  ]);

  const [sanityRoot, layout] = await rootData;

  const seo = seoPayload.root({
    root: sanityRoot.data,
    sanity: {
      dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
      projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
    },
    url: request.url,
  });

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: sanityRoot,
    request,
    storefront,
  });

  return {
    cart: cart.get(),
    collectionListPromise,
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    env: {
      /*
       * Be careful not to expose any sensitive environment variables here.
       */
      NODE_ENV: env.NODE_ENV,
      PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
      PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
      PUBLIC_STOREFRONT_API_VERSION: env.PUBLIC_STOREFRONT_API_VERSION,
      PUBLIC_SANITY_STUDIO_DATASET: env.PUBLIC_SANITY_STUDIO_DATASET,
      PUBLIC_SANITY_STUDIO_PROJECT_ID: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
      SANITY_STUDIO_USE_PREVIEW_MODE: env.SANITY_STUDIO_USE_PREVIEW_MODE,
    },
    featuredCollectionPromise,
    featuredProductPromise,
    isLoggedIn: isLoggedInPromise,
    locale,
    sanityPreviewMode,
    sanityRoot,
    seo,
    shop: getShopAnalytics({
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
      storefront: storefront,
    }),
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const {pathname} = useLocation();

  const isCmsRoute = pathname.includes('/cms');

  return (
    <html lang={data?.locale.language.toLowerCase()}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Fonts />
        <Links />
        <CssVars />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
        {isCmsRoute ? (
          children
        ) : data ? (
          <Analytics.Provider
            cart={data.cart}
            consent={data.consent}
            shop={data.shop}
          >
            <AppLayout>{children}</AppLayout>
            <CustomAnalytics />
          </Analytics.Provider>
        ) : (
          <AppLayout>{children}</AppLayout>
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);
  const {themeContent} = useSanityThemeContent();
  const errorStatus = isRouteError ? routeError.status : 500;
  const collectionsPath = useLocalePath({path: '/collections'});
  const navigate = useNavigate();

  let title = themeContent?.error?.serverError;
  let pageType = 'page';

  if (isRouteError) {
    title = themeContent?.error?.pageNotFound;
    if (errorStatus === 404) pageType = routeError.data || pageType;
  }

  return (
    <section>
      <div className="container flex flex-col items-center justify-center py-20 text-center">
        <span>{errorStatus}</span>
        <h1 className="mt-5">{title}</h1>
        {errorStatus === 404 ? (
          <Button asChild className="mt-6" variant="secondary">
            <Link to={collectionsPath}>
              {themeContent?.cart?.continueShopping}
            </Link>
          </Button>
        ) : (
          <Button
            className="mt-6"
            onClick={() => navigate(0)}
            variant="secondary"
          >
            {themeContent?.error?.reloadPage}
          </Button>
        )}
      </div>
    </section>
  );
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as Awaited<ReturnType<typeof loader>>;
};

function generateFaviconUrls({
  sanityRoot,
  env,
}: {
  env: NonNullable<Awaited<ReturnType<typeof loader>>>['env'];
  sanityRoot: NonNullable<Awaited<ReturnType<typeof loader>>>['sanityRoot'];
}) {
  const favicon = sanityRoot.data?.settings?.favicon;

  if (!favicon) {
    return [
      {
        href: faviconAsset,
        rel: 'icon',
        tagName: 'link',
        type: 'image/x-icon',
      },
    ];
  }

  const faviconUrl = generateSanityImageUrl({
    dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
    height: 32,
    projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 32,
  });

  const appleTouchIconUrl = generateSanityImageUrl({
    dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
    height: 180,
    projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 180,
  });

  return [
    {
      href: faviconUrl,
      rel: 'icon',
      tagName: 'link',
      type: 'image/x-icon',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon',
      tagName: 'link',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon-precomposed',
      tagName: 'link',
    },
  ];
}
