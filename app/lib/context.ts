import {createHydrogenContext} from '@shopify/hydrogen';
import {getLocaleFromRequest} from 'countries';

import {CART_QUERY_FRAGMENT} from '~/graphql/fragments';

import type {HydrogenSession} from './hydrogen.session.server';
import type {SanitySession} from './sanity/sanity.session.server';

import {createSanityClient} from './sanity/sanity.server';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext({
  cache,
  env,
  request,
  sanitySession,
  session,
  waitUntil,
}: {
  cache: Cache;
  env: Env;
  request: Request;
  sanitySession: SanitySession;
  session: HydrogenSession;
  waitUntil: ExecutionContext['waitUntil'];
}) {
  const isDev = env.NODE_ENV === 'development';
  const locale = getLocaleFromRequest(request);

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
      apiVersion: env.SANITY_STUDIO_API_VERSION,
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
      studioUrl: env.SANITY_STUDIO_URL,
      token: env.SANITY_STUDIO_TOKEN,
      useCdn: !env.NODE_ENV || env.NODE_ENV === 'production',
      useStega: env.SANITY_STUDIO_USE_PREVIEW_MODE,
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
