import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from '@remix-run/react';
import {Analytics, useNonce} from '@shopify/hydrogen';

import {RootLoader} from './root';
import {Fonts} from './components/fonts';
import {CssVars} from './components/css-vars';
import {CustomAnalytics} from './components/custom-analytics';
import {AppLayout} from './components/layout';

export default function Layout() {
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
      <body className="bg-background text-foreground flex min-h-screen flex-col overflow-x-hidden">
        {isCmsRoute ? (
          <Outlet />
        ) : data ? (
          <Analytics.Provider
            cart={data.cart}
            consent={data.consent}
            shop={data.shop}
          >
            <AppLayout>
              <Outlet />
            </AppLayout>
            <CustomAnalytics />
          </Analytics.Provider>
        ) : (
          <AppLayout>
            <Outlet />
          </AppLayout>
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
