import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import type {CollectionDetailsQuery} from 'storefrontapi.generated';

import {useLoaderData} from '@remix-run/react';
import {Analytics} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';
import invariant from 'tiny-invariant';

import {CmsSection} from '~/components/CmsSection';
import {COLLECTION_QUERY} from '~/graphql/queries';
import {useSanityData} from '~/hooks/useSanityData';
import {mergeMeta} from '~/lib/meta';
import {resolveShopifyPromises} from '~/lib/resolveShopifyPromises';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {seoPayload} from '~/lib/seo.server';
import {COLLECTION_QUERY as CMS_COLLECTION_QUERY} from '~/qroq/queries';

export const meta: MetaFunction<typeof loader> = mergeMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);
export async function loader({context, params, request}: LoaderFunctionArgs) {
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
    sanity.query({
      groqdQuery: CMS_COLLECTION_QUERY,
      params: queryParams,
    }),
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

  return defer({
    cmsCollection,
    collection,
    collectionListPromise,
    collectionProductGridPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    seo,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: CMS_COLLECTION_QUERY.query,
    }),
  });
}

export default function Collection() {
  const {cmsCollection, collection} = useLoaderData<typeof loader>();
  const {data, encodeDataAttribute} = useSanityData({initial: cmsCollection});
  const template =
    data?.collection?.template || data?.defaultCollectionTemplate;

  return (
    <>
      {template?.sections && template.sections.length > 0
        ? template.sections.map((section, index) => (
            <CmsSection
              data={section}
              encodeDataAttribute={encodeDataAttribute}
              index={index}
              key={section._key}
            />
          ))
        : null}
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
