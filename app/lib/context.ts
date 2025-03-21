import {createHydrogenContext, createWithCache} from '@shopify/hydrogen';
import {getLocaleFromRequest} from 'countries';

import {CART_QUERY_FRAGMENT} from '~/data/shopify/fragments';
import {SANITY_API_VERSION, SANITY_STUDIO_URL} from '~/sanity/constants';

import {envVariables} from './env.server';
import {AppSession} from './hydrogen.session.server';
import {createSanityContext} from './sanity/sanity.server';
import {SanitySession} from './sanity/sanity.session.server';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
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
  const withCache = createWithCache({cache, waitUntil, request});
  const sanityPreviewMode = await sanitySession.has('previewMode');

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
  const sanity = createSanityContext({
    withCache,
    clientConfig: {
      apiVersion: SANITY_API_VERSION,
      dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
      projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
      useCdn: !env.NODE_ENV || env.NODE_ENV === 'production',
      useStega: env.SANITY_STUDIO_USE_PREVIEW_MODE,
    },
    preview: {
      enabled: sanityPreviewMode,
      studioUrl: SANITY_STUDIO_URL,
      token: env.SANITY_STUDIO_TOKEN,
    },
  });

  return {
    ...hydrogenContext,
    env: envVars,
    isDev,
    locale,
    sanity,
    sanityPreviewMode,
    sanitySession,
  };
}
