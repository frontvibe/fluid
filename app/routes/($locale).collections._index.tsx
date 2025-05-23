import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';

import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';

import {CollectionListGrid} from '~/components/collection-list-grid';
import {COLLECTIONS_QUERY} from '~/data/shopify/queries';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {mergeMeta} from '~/lib/meta';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {seoPayload} from '~/lib/seo.server';

const PAGINATION_SIZE = 4;

export const meta: MetaFunction<typeof loader> = mergeMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);

export const loader = async ({
  context: {storefront},
  request,
}: LoaderFunctionArgs) => {
  const variables = getPaginationVariables(request, {
    pageBy: PAGINATION_SIZE,
  });
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return {collections, seo};
};

export default function Collections() {
  const data = useLoaderData<typeof loader>();
  const {themeContent} = useSanityThemeContent();

  return (
    <div className="container py-20">
      {data.collections?.nodes.length > 0 ? (
        <CollectionListGrid collections={data.collections} />
      ) : (
        <p>{themeContent?.collection?.noCollectionFound}</p>
      )}
    </div>
  );
}
