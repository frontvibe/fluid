import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables, getSeoMeta} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

import {CollectionListGrid} from '~/components/CollectionListGrid';
import {COLLECTIONS_QUERY} from '~/graphql/queries';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {seoPayload} from '~/lib/seo.server';

const PAGINATION_SIZE = 4;

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

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

  return json({collections, seo});
};

export default function Collections() {
  const data = useLoaderData<typeof loader>();
  const themeContent = useSanityRoot().data?.themeContent;

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
