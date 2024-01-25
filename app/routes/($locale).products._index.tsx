import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
import {flattenConnection, getPaginationVariables} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

import {ProductCardGrid} from '~/components/product/ProductCardGrid';
import {ALL_PRODUCTS_QUERY} from '~/graphql/queries';

const PAGE_BY = 8;

export async function loader({
  context: {storefront},
  request,
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  return json({products: data.products});
}

export default function AllProducts() {
  const data = useLoaderData<typeof loader>();
  const products = data.products?.nodes.length
    ? flattenConnection(data.products)
    : [];

  return (
    <div className="container py-20">
      <ProductCardGrid products={products} />
    </div>
  );
}
