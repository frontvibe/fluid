import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import type {ProductQuery} from 'storefrontapi.generated';

import {useLoaderData} from '@remix-run/react';
import {
  AnalyticsPageType,
  getSelectedProductOptions,
  getSeoMeta,
} from '@shopify/hydrogen';
import {ProductProvider} from '@shopify/hydrogen-react';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';
import invariant from 'tiny-invariant';

import {CmsSection} from '~/components/CmsSection';
import {PRODUCT_QUERY, VARIANTS_QUERY} from '~/graphql/queries';
import {useSanityData} from '~/hooks/useSanityData';
import {resolveShopifyPromises} from '~/lib/resolveShopifyPromises';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {seoPayload} from '~/lib/seo.server';
import {PRODUCT_QUERY as CMS_PRODUCT_QUERY} from '~/qroq/queries';

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export async function loader({context, params, request}: LoaderFunctionArgs) {
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
    sanity.query({
      groqdQuery: CMS_PRODUCT_QUERY,
      params: queryParams,
    }),
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

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {
      country: storefront.i18n.country,
      handle: productHandle,
      language: storefront.i18n.language,
    },
  });

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

  const productAnalytics: ShopifyAnalyticsProduct = {
    brand: product.vendor,
    name: product.title,
    price: product.priceRange.minVariantPrice.amount,
    productGid: product.id,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant: product.variants.nodes[0],
    url: request.url,
  });

  return defer({
    analytics: {
      pageType: AnalyticsPageType.product,
      products: [productAnalytics],
      resourceId: product.id,
      totalValue: parseFloat(product.priceRange.minVariantPrice.amount),
    },
    cmsProduct,
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    product,
    relatedProductsPromise,
    seo,
    variants,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: CMS_PRODUCT_QUERY.query,
    }),
  });
}

export default function Product() {
  const {cmsProduct, product} = useLoaderData<typeof loader>();
  const {data, encodeDataAttribute} = useSanityData({initial: cmsProduct});
  const template = data?.product?.template || data?.defaultProductTemplate;

  return (
    <ProductProvider data={product}>
      {template?.sections &&
        template.sections.length > 0 &&
        template.sections.map((section) => (
          <CmsSection
            data={section}
            encodeDataAttribute={encodeDataAttribute}
            key={section._key}
          />
        ))}
    </ProductProvider>
  );
}
