import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

import {CollectionListGrid} from '~/components/CollectionListGrid';
import {COLLECTIONS_QUERY} from '~/graphql/queries';

const PAGINATION_SIZE = 4;

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

  return json({collections});
};

export default function Collections() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container py-20">
      <CollectionListGrid collections={data.collections} />
    </div>
  );
}
