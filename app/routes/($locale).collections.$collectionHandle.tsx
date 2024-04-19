import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import type {CollectionDetailsQuery} from 'storefrontapi.generated';

import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {AnalyticsPageType} from '@shopify/hydrogen-react';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';
import invariant from 'tiny-invariant';

import {CmsSection} from '~/components/CmsSection';
import {COLLECTION_QUERY} from '~/graphql/queries';
import {useSanityData} from '~/hooks/useSanityData';
import {resolveShopifyPromises} from '~/lib/resolveShopifyPromises';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {seoPayload} from '~/lib/seo.server';
import {COLLECTION_QUERY as CMS_COLLECTION_QUERY} from '~/qroq/queries';

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

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
    analytics: {
      collectionHandle,
      pageType: AnalyticsPageType.collection,
      resourceId: collection.id,
    },
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
  const {cmsCollection} = useLoaderData<typeof loader>();
  const {data, encodeDataAttribute} = useSanityData({initial: cmsCollection});
  const template =
    data?.collection?.template || data?.defaultCollectionTemplate;

  return template?.sections && template.sections.length > 0
    ? template.sections.map((section) => (
        <CmsSection
          data={section}
          encodeDataAttribute={encodeDataAttribute}
          key={section._key}
        />
      ))
    : null;
}
