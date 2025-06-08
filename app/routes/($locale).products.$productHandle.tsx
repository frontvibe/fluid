import type {PRODUCT_QUERYResult} from 'types/sanity/sanity.generated';
import type {ProductQuery} from 'types/shopify/storefrontapi.generated';

import {
  Analytics,
  getSelectedProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  useOptimisticVariant,
  getProductOptions,
} from '@shopify/hydrogen';
import {DEFAULT_LOCALE} from 'countries';
import invariant from 'tiny-invariant';

import type {Route} from './+types/($locale).products.$productHandle';

import {CmsSection} from '~/components/cms-section';
import {PRODUCT_QUERY as CMS_PRODUCT_QUERY} from '~/data/sanity/queries';
import {PRODUCT_QUERY} from '~/data/shopify/queries';
import {resolveShopifyPromises} from '~/lib/resolve-shopify-promises';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {seoPayload} from '~/lib/seo.server';
import {mergeRouteModuleMeta} from '~/lib/meta';
import {ProductProvider} from '~/components/product/product-provider';

export const meta: Route.MetaFunction = mergeRouteModuleMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {productHandle} = params;
  const {locale, sanity, storefront} = context;
  const language = locale?.language.toLowerCase();

  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
    productHandle,
  };

  const productData = Promise.all([
    sanity.loadQuery<PRODUCT_QUERYResult>(CMS_PRODUCT_QUERY, queryParams),
    storefront.query<ProductQuery>(PRODUCT_QUERY, {
      variables: {
        country: storefront.i18n.country,
        handle: productHandle,
        language: storefront.i18n.language,
        selectedOptions,
      },
    }),
  ]);

  const [cmsProduct, {product}] = await productData;

  if (!product?.id || !cmsProduct) {
    throw new Response('product', {status: 404});
  }

  const selectedVariant = product.selectedOrFirstAvailableVariant ?? {};
  const variants = getAdjacentAndFirstAvailableVariants(product);

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    relatedProductsPromise,
  } = resolveShopifyPromises({
    document: cmsProduct,
    productId: product.id,
    request,
    storefront,
  });

  const seo = seoPayload.product({
    product: {...product, variants},
    selectedVariant,
    url: request.url,
  });

  return {
    cmsProduct,
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    product,
    relatedProductsPromise,
    seo,
    variants,
  };
}

export default function Product({loaderData}: Route.ComponentProps) {
  const {
    cmsProduct: {data},
    product,
  } = loaderData;

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(
    product.selectedOrFirstAvailableVariant?.selectedOptions || [],
  );

  const template = data?.product?.template || data?.defaultProductTemplate;

  return (
    <ProductProvider product={product}>
      {template?.sections &&
        template.sections.length > 0 &&
        template.sections.map((section, index) => (
          <CmsSection data={section} index={index} key={section._key} />
        ))}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              price:
                product.selectedOrFirstAvailableVariant?.price.amount || '0',
              quantity: 1,
              title: product.title,
              variantId: product.selectedOrFirstAvailableVariant?.id || '',
              variantTitle:
                product.selectedOrFirstAvailableVariant?.title || '',
              vendor: product.vendor,
            },
          ],
        }}
      />
    </ProductProvider>
  );
}
