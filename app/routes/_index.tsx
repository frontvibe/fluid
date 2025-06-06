import type {PAGE_QUERYResult} from 'types/sanity/sanity.generated';
import type {Route} from './+types/($locale).$';

import {DEFAULT_LOCALE} from 'countries';

import {PAGE_QUERY} from '~/data/sanity/queries';
import {mergeRouteModuleMeta} from '~/lib/meta';
import {resolveShopifyPromises} from '~/lib/resolve-shopify-promises';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {seoPayload} from '~/lib/seo.server';

import PageRoute from './($locale).$';

export const meta: Route.MetaFunction = mergeRouteModuleMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);

export async function loader({context, request}: Route.LoaderArgs) {
  const {env, locale, sanity, storefront} = context;
  const language = locale?.language.toLowerCase();
  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle: 'home',
    language,
  };

  const page = await sanity.loadQuery<PAGE_QUERYResult>(
    PAGE_QUERY,
    queryParams,
  );

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: page,
    request,
    storefront,
  });

  if (!page.data) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const seo = seoPayload.home({
    page: page.data,
    sanity: {
      dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
      projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
    },
  });

  return {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    page,
    seo,
  };
}

/*
 * Homepage route component is the same as the page route component
 * so we can just export the page route component as the homepage route component.
 */
export default PageRoute;
