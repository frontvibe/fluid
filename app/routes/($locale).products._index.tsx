import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
import {flattenConnection, getPaginationVariables} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

import {ProductCardGrid} from '~/components/product/ProductCardGrid';
import {ALL_PRODUCTS_QUERY} from '~/graphql/queries';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {mergeMeta} from '~/lib/meta';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {seoPayload} from '~/lib/seo.server';

const PAGE_BY = 9;

export const meta: MetaFunction<typeof loader> = mergeMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);

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

  const seo = seoPayload.collection({
    collection: {
      description: 'All the store products',
      descriptionHtml: 'All the store products',
      handle: 'products',
      id: 'all-products',
      metafields: [],
      products: data.products,
      seo: {
        description: 'All the store products',
        title: 'All Products',
      },
      title: 'All Products',
      updatedAt: '',
    },
    url: request.url,
  });

  return json({products: data.products, seo});
}

export default function AllProducts() {
  const data = useLoaderData<typeof loader>();
  const themeContent = useSanityRoot().data?.themeContent;
  const products = data.products?.nodes.length
    ? flattenConnection(data.products)
    : [];

  return (
    <div className="container py-20">
      {products.length > 0 ? (
        <ProductCardGrid products={products} />
      ) : (
        <p>{themeContent?.collection?.noProductFound}</p>
      )}
    </div>
  );
}
