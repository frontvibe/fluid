import {flattenConnection, getPaginationVariables} from '@shopify/hydrogen';

import type {Route} from './+types/($locale).products._index';

import {ProductCardGrid} from '~/components/product/product-card-grid';
import {ALL_PRODUCTS_QUERY} from '~/data/shopify/queries';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {seoPayload} from '~/lib/seo.server';
import {mergeRouteModuleMeta} from '~/lib/meta';

const PAGE_BY = 9;

export const meta: Route.MetaFunction = mergeRouteModuleMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);

export async function loader({
  context: {storefront},
  request,
}: Route.LoaderArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      selectedOptions: [],
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

  return {products: data.products, seo};
}

export default function AllProducts({loaderData}: Route.ComponentProps) {
  const data = loaderData;
  const {themeContent} = useSanityThemeContent();
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
