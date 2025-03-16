import {createHydrogenContext} from '@shopify/hydrogen';
import {type PlatformProxy} from 'wrangler';

import {CART_QUERY_FRAGMENT} from './app/graphql/fragments';
import {envVariables} from './app/lib/env.server';
import {AppSession} from './app/lib/hydrogen.session.server';
import {createSanityClient} from './app/lib/sanity/sanity.server';
import {SanitySession} from './app/lib/sanity/sanity.session.server';
import {SANITY_API_VERSION, SANITY_STUDIO_URL} from './app/sanity/constants';
import {getLocaleFromRequest} from './countries';

type GetLoadContextArgs = {
  context: {
    cloudflare: Omit<PlatformProxy<Env>, 'caches' | 'cf' | 'dispose'> & {
      caches: CacheStorage | PlatformProxy<Env>['caches'];
      cf: Request['cf'];
    };
  };
  request: Request;
};

declare module '@remix-run/cloudflare' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    // This will merge the result of `getLoadContext` into the `AppLoadContext`
  }
}

export async function getLoadContext({context, request}: GetLoadContextArgs) {
  const env = context.cloudflare.env;
  const executionContext = context.cloudflare.ctx;
  const caches = context.cloudflare.caches;
  const envVars = envVariables(env);
  const isDev = envVars.NODE_ENV === 'development';
  const locale = getLocaleFromRequest(request);
  const waitUntil = executionContext.waitUntil.bind(executionContext);

  /*
   * Open a cache instance in the worker and a custom session instance.
   */
  const [cache, session, sanitySession] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
    SanitySession.init(request, [env.SESSION_SECRET]),
  ]);
  const sanityPreviewMode = await sanitySession.has('previewMode');

  console.log(envVars);

  const hydrogenContext = createHydrogenContext({
    cache,
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
    env: envVars,
    i18n: {country: locale.country, language: locale.language},
    request,
    session,
    waitUntil,
  });

  /*
   * Sanity CMS client
   */
  const sanity = createSanityClient({
    cache,
    config: {
      apiVersion: SANITY_API_VERSION,
      dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
      projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
      studioUrl: SANITY_STUDIO_URL,
      token: env.SANITY_STUDIO_TOKEN,
      useCdn: !env.NODE_ENV || env.NODE_ENV === 'production',
      useStega: env.SANITY_STUDIO_USE_PREVIEW_MODE,
    },
    isPreviewMode: sanityPreviewMode,
    request,
    waitUntil,
  });

  const appLoadContext = {
    ...context,
    ...hydrogenContext,
    env: envVars,
    isDev,
    locale,
    sanity,
    sanityPreviewMode,
    sanitySession,
  };

  return appLoadContext;
}
