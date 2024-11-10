import {createHydrogenContext} from '@shopify/hydrogen';
import {getLocaleFromRequest} from 'countries';

import {CART_QUERY_FRAGMENT} from '~/graphql/fragments';

import {envVariables} from './env.server';
import {HydrogenSession} from './hydrogen.session.server';
import {createSanityClient} from './sanity/sanity.server';
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
    HydrogenSession.init(request, [envVars.SESSION_SECRET]),
    SanitySession.init(request, [envVars.SESSION_SECRET]),
  ]);
  const sanityPreviewMode = await sanitySession.has('previewMode');

  const hydrogenContext = createHydrogenContext({
    cache,
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
    env,
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
      apiVersion: envVars.SANITY_STUDIO_API_VERSION,
      dataset: envVars.SANITY_STUDIO_DATASET,
      projectId: envVars.SANITY_STUDIO_PROJECT_ID,
      studioUrl: envVars.SANITY_STUDIO_URL,
      token: envVars.SANITY_STUDIO_TOKEN,
      useCdn: !envVars.NODE_ENV || envVars.NODE_ENV === 'production',
      useStega: envVars.SANITY_STUDIO_USE_PREVIEW_MODE,
    },
    isPreviewMode: sanityPreviewMode,
    request,
    waitUntil,
  });

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
    isDev,
    locale,
    sanity,
    sanityPreviewMode,
    sanitySession,
    waitUntil,
  };
}
