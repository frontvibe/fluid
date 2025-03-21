import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@shopify/remix-oxygen';
import type {ReactElement} from 'react';

import {useLoaderData} from '@remix-run/react';
import polarisCss from '@shopify/polaris/build/esm/styles.css?url';
import {lazy, Suspense} from 'react';

import {ClientOnly} from '~/components/client-only';

import studioStyles from './studio.css?url';

/**
 * Provide a consistent fallback to prevent hydration mismatch errors.
 */
function SanityStudioFallback(): ReactElement {
  return <></>;
}

/**
 * If server-side rendering, then return the fallback instead of the heavy dependency.
 * @see https://remix.run/docs/en/1.14.3/guides/constraints#browser-only-code-on-the-server
 */
const SanityStudio =
  typeof document === 'undefined'
    ? SanityStudioFallback
    : lazy(
        () =>
          /**
           * `lazy` expects the component as the default export
           * @see https://react.dev/reference/react/lazy
           */
          import('./sanity-studio.client'),
      );

export const meta: MetaFunction = () => [
  {
    content: 'width=device-width,initial-scale=1,viewport-fit=cover',
    name: 'viewport',
  },
  {
    content: 'same-origin',
    name: 'referrer',
  },
  {
    content: 'noindex',
    name: 'robots',
  },
];

export function headers(): HeadersInit {
  return {
    'Cache-Control': 'no-store',
  };
}

export const links: LinksFunction = () => {
  return [
    {href: studioStyles, rel: 'stylesheet'},
    {href: polarisCss, rel: 'stylesheet'},
  ];
};

export function loader({context}: LoaderFunctionArgs) {
  const {env} = context;
  const projectId = env.PUBLIC_SANITY_STUDIO_PROJECT_ID;
  const dataset = env.PUBLIC_SANITY_STUDIO_DATASET;
  const shopifyStoreDomain = env.PUBLIC_STORE_DOMAIN;

  return {
    dataset,
    projectId,
    shopifyStoreDomain,
  };
}

export default function Studio() {
  const {dataset, projectId, shopifyStoreDomain} =
    useLoaderData<typeof loader>();

  return (
    <ClientOnly>
      {() => (
        <Suspense>
          <SanityStudio
            dataset={dataset}
            projectId={projectId}
            shopifyStoreDomain={shopifyStoreDomain}
          />
        </Suspense>
      )}
    </ClientOnly>
  );
}
