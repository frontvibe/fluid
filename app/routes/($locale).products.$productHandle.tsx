import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductQuery} from 'storefrontapi.generated';

import {useLoaderData} from '@remix-run/react';
import {getSelectedProductOptions} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';
import invariant from 'tiny-invariant';

import {CmsSection} from '~/components/CmsSection';
import {PRODUCT_QUERY, VARIANTS_QUERY} from '~/graphql/queries';
import {useSanityData} from '~/hooks/useSanityData';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {resolveShopifyPromises} from '~/lib/resolveShopifyPromises';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {PRODUCT_QUERY as CMS_PRODUCT_QUERY} from '~/qroq/queries';

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
    request,
    storefront,
  });

  return defer({
    cmsProduct,
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    product,
    relatedProductsPromise,
    variants,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: CMS_PRODUCT_QUERY.query,
    }),
  });
}

export default function Product() {
  const {cmsProduct} = useLoaderData<typeof loader>();
  const {data, encodeDataAttribute} = useSanityData(cmsProduct);
  const template = data?.product?.template || data?.defaultProductTemplate;

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
