import type {COLLECTION_QUERY_RESULT} from 'types/sanity/sanity.generated';
import type {CollectionDetailsQuery} from 'types/shopify/storefrontapi.generated';

import {Analytics} from '@shopify/hydrogen';
import {DEFAULT_LOCALE} from 'countries';
import invariant from 'tiny-invariant';

import type {Route} from './+types/($locale).collections.$collectionHandle';

import {COLLECTION_QUERY as CMS_COLLECTION_QUERY} from '~/data/sanity/queries';
import {useEncodeDataAttribute} from '~/hooks/use-encode-data-attribute';
import {SectionsRenderer} from '~/components/sections-renderer';
import {COLLECTION_QUERY} from '~/data/shopify/queries';
import {mergeRouteModuleMeta} from '~/lib/meta';
import {resolveShopifyPromises} from '~/lib/resolve-shopify-promises';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {seoPayload} from '~/lib/seo.server';

export const meta: Route.MetaFunction = mergeRouteModuleMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);
export async function loader({context, params, request}: Route.LoaderArgs) {
  const {collectionHandle} = params;
  const {locale, sanity, storefront} = context;
  const language = locale?.language.toLowerCase();

  invariant(collectionHandle, 'Missing collectionHandle param');

  const queryParams = {
    collectionHandle,
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
  };

  const collectionData = Promise.all([
    sanity.loadQuery<COLLECTION_QUERY_RESULT>(
      CMS_COLLECTION_QUERY,
      queryParams,
    ),
    storefront.query<CollectionDetailsQuery>(COLLECTION_QUERY, {
      variables: {
        country: storefront.i18n.country,
        handle: collectionHandle,
        language: storefront.i18n.language,
      },
    }),
  ]);

  const [cmsCollection, {collection}] = await collectionData;

  if (!collection?.id || !cmsCollection) {
    throw new Response('collection', {status: 404});
  }

  const {
    collectionListPromise,
    collectionProductGridPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    collectionId: collection.id,
    document: cmsCollection,
    request,
    storefront,
  });

  const seo = seoPayload.collection({collection, url: request.url});

  return {
    cmsCollection,
    collection,
    collectionListPromise,
    collectionProductGridPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    seo,
  };
}

export default function Collection({loaderData}: Route.ComponentProps) {
  const {
    cmsCollection: {data},
    collection,
  } = loaderData;
  const template =
    data?.collection?.template || data?.defaultCollectionTemplate;
  const encodeDataAttribute = useEncodeDataAttribute(template ?? {});

  return (
    <>
      {template?.sections && template.sections.length > 0 ? (
        <SectionsRenderer
          documentId={template._id}
          documentType={template._type}
          encodeDataAttribute={encodeDataAttribute}
          sections={template.sections}
        />
      ) : null}
      <Analytics.CollectionView
        data={{
          collection: {
            handle: collection.handle,
            id: collection.id,
          },
        }}
      />
    </>
  );
}
