import type {ShouldRevalidateFunction} from '@remix-run/react';
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';
import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import {useNonce} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';

import {Layout} from '~/components/layout/Layout';

import type {HydrogenSession} from './lib/hydrogen.session.server';

import favicon from '../public/favicon.svg';
import {Fonts} from './components/Fonts';
import {useLocale} from './hooks/useLocale';
import {useSettingsCssVars} from './hooks/useSettingsCssVars';
import {generateFontsPreloadLinks} from './lib/fonts';
import {sanityPreviewPayload} from './lib/sanity/sanity.payload.server';
import {ROOT_QUERY} from './qroq/queries';
import tailwindCss from './styles/tailwind.css';

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  formMethod,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
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
    {href: favicon, rel: 'icon', type: 'image/svg+xml'},
  ];
}

export const meta: MetaFunction<typeof loader> = (loaderData) => {
  const {data} = loaderData;
  // Preload fonts files to avoid FOUT (flash of unstyled text)
  const fontsPreloadLinks = generateFontsPreloadLinks({
    fontsData: data?.sanityRoot.data?.fonts,
  });

  return [
    {
      // Preconnect to the Sanity CDN before loading fonts
      href: 'https://cdn.sanity.io',
      rel: 'preconnect',
      tagName: 'link',
    },
    ...fontsPreloadLinks,
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {cart, env, locale, sanity, sanityPreviewMode, session} = context;
  const language = locale?.language.toLowerCase();
  const customerAccessToken = await session.get('customerAccessToken');

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
  };

  const sanityRoot = await sanity.query({
    groqdQuery: ROOT_QUERY,
    params: queryParams,
  });

  // validate the customer access token is valid
  const {headers, isLoggedIn} = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  return defer(
    {
      cart: cartPromise,
      env: {
        /*
         * Be careful not to expose any sensitive environment variables here.
         */
        NODE_ENV: env.NODE_ENV,
        PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
        PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
        PUBLIC_STOREFRONT_API_VERSION: env.PUBLIC_STOREFRONT_API_VERSION,
        SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION,
        SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
        SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
        SANITY_STUDIO_URL: env.SANITY_STUDIO_URL,
        SANITY_STUDIO_USE_STEGA: env.SANITY_STUDIO_USE_STEGA,
      },
      isLoggedIn,
      locale,
      sanityPreviewMode,
      sanityRoot,
      ...sanityPreviewPayload({
        context,
        params: queryParams,
        query: ROOT_QUERY.query,
      }),
    },
    {headers},
  );
}

export default function App() {
  const nonce = useNonce();
  const locale = useLocale();
  const cssVars = useSettingsCssVars({});

  return (
    <html lang={locale?.language}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Fonts />
        <Links />
      </head>
      <body
        className="color-scheme flex min-h-screen flex-col [&_main]:flex-1"
        style={cssVars}
      >
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const nonce = useNonce();
  const routeError = useRouteError();
  const locale = useLocale();
  const isRouteError = isRouteErrorResponse(routeError);

  let title = 'Error';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <html lang={locale?.language}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Fonts />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col [&_main]:flex-1">
        <Layout>
          <section>
            <div className="container">
              <h1>{title}</h1>
            </div>
          </section>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```js
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 * );
 * ```
 */
async function validateCustomerAccessToken(
  session: HydrogenSession,
  customerAccessToken?: CustomerAccessToken,
) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return {headers, isLoggedIn};
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return {headers, isLoggedIn};
}
