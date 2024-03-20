import type {Storefront} from '@shopify/hydrogen';
import type {InferType} from 'groqd';
import type {
  CollectionsQuery,
  FeaturedCollectionQuery,
  FeaturedProductQuery,
} from 'storefrontapi.generated';

import {getPaginationVariables, parseGid} from '@shopify/hydrogen';

import type {
  COLLECTION_QUERY,
  PAGE_QUERY,
  PRODUCT_QUERY,
  ROOT_QUERY,
} from '~/qroq/queries';

import {
  COLLECTION_PRODUCT_GRID_QUERY,
  COLLECTIONS_QUERY,
  FEATURED_COLLECTION_QUERY,
  FEATURED_PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
} from '~/graphql/queries';

import {getFiltersFromParam} from './shopifyCollection';

type SanityPageData = InferType<typeof PAGE_QUERY>;
type SanityProductData = InferType<typeof PRODUCT_QUERY>;
type SanityCollectionData = InferType<typeof COLLECTION_QUERY>;
type SanityRootData = InferType<typeof ROOT_QUERY>;
type PromiseResolverArgs = {
  collectionId?: string;
  document: {
    data:
      | SanityCollectionData
      | SanityPageData
      | SanityProductData
      | SanityRootData;
  };
  productId?: string;
  request: Request;
  storefront: Storefront;
};

/**
 * Looks for promises in a list of sections of the given Sanity document.
 * For example if a Sanity page contains a **Featured Collection Section**, a promise to fetch
 * the `collection` data is needed. The promise will be resolved within the component.
 */
export function resolveShopifyPromises({
  collectionId,
  document,
  productId,
  request,
  storefront,
}: PromiseResolverArgs) {
  const featuredCollectionPromise = resolveFeaturedCollectionPromise({
    document,
    request,
    storefront,
  });

  const collectionListPromise = resolveCollectionListPromise({
    document,
    request,
    storefront,
  });

  const featuredProductPromise = resolveFeaturedProductPromise({
    document,
    request,
    storefront,
  });

  const relatedProductsPromise = resolveRelatedProductsPromise({
    document,
    productId,
    request,
    storefront,
  });

  const collectionProductGridPromise = resolveCollectionProductGridPromise({
    collectionId,
    document,
    request,
    storefront,
  });

  return {
    collectionListPromise,
    collectionProductGridPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    relatedProductsPromise,
  };
}

function getSections(document: {
  data:
    | SanityCollectionData
    | SanityPageData
    | SanityProductData
    | SanityRootData;
}) {
  if (document.data?._type === 'root') {
    return document.data.footer?.sections;
  }

  if (document?.data?._type === 'page' || document?.data?._type === 'home') {
    return document.data.sections;
  }

  if (document?.data?._type === 'product') {
    return (
      document.data?.product?.template?.sections ||
      document.data?.defaultProductTemplate?.sections
    );
  }

  if (document?.data?._type === 'collection') {
    return (
      document.data?.collection?.template?.sections ||
      document.data?.defaultCollectionTemplate?.sections
    );
  }

  return [];
}

function resolveFeaturedCollectionPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  const promises: Promise<FeaturedCollectionQuery>[] = [];

  const sections = getSections(document);

  for (const section of sections || []) {
    if (section._type === 'featuredCollectionSection') {
      const gid = section.collection?.store.gid;
      const first = section.maxProducts || 3;

      if (!gid) {
        return undefined;
      }

      const promise = storefront.query(FEATURED_COLLECTION_QUERY, {
        variables: {
          country: storefront.i18n.country,
          first,
          id: gid,
          language: storefront.i18n.language,
        },
      });

      promises.push(promise);
    }
  }

  /**
   * Promise.allSettled is used to resolve all promises even if one of them fails.
   * This is useful when a page contains multiple sections that fetch data from Shopify.
   * If one of the promises fails, the page will still be rendered and only
   * the section that failed will be empty.
   */
  const featuredCollectionPromise = Promise.allSettled(promises);

  return featuredCollectionPromise;
}

function resolveCollectionListPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  const promises: Promise<CollectionsQuery>[] = [];

  const sections = getSections(document);

  for (const section of sections || []) {
    if (section._type === 'collectionListSection') {
      const first = section.collections?.length;
      const ids = section.collections?.map(
        (collection) => parseGid(collection.store.gid).id,
      );
      const query = ids?.map((id) => `(id:${id})`).join(' OR ');

      if (!ids?.length || !first) {
        return undefined;
      }

      const promise = storefront.query(COLLECTIONS_QUERY, {
        variables: {
          country: storefront.i18n.country,
          first,
          language: storefront.i18n.language,
          query,
        },
      });

      promises.push(promise);
    }
  }

  /**
   * Promise.allSettled is used to resolve all promises even if one of them fails.
   * This is useful when a page contains multiple sections that fetch data from Shopify.
   * If one of the promises fails, the page will still be rendered and only
   * the section that failed will be empty.
   */
  const collectionListPromise = Promise.allSettled(promises);

  return collectionListPromise;
}

function resolveFeaturedProductPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  const promises: Promise<FeaturedProductQuery>[] = [];

  const sections = getSections(document);

  for (const section of sections || []) {
    if (section._type === 'featuredProductSection') {
      const gid = section.product?.store.gid;

      if (!gid) {
        return undefined;
      }

      const promise = storefront.query(FEATURED_PRODUCT_QUERY, {
        variables: {
          country: storefront.i18n.country,
          id: gid,
          language: storefront.i18n.language,
        },
      });

      promises.push(promise);
    }
  }

  /**
   * Promise.allSettled is used to resolve all promises even if one of them fails.
   * This is useful when a page contains multiple sections that fetch data from Shopify.
   * If one of the promises fails, the page will still be rendered and only
   * the section that failed will be empty.
   */
  const featuredProductPromise = Promise.allSettled(promises);

  return featuredProductPromise;
}

async function resolveRelatedProductsPromise({
  document,
  productId,
  storefront,
}: PromiseResolverArgs) {
  let promise;

  if (document.data?._type !== 'product' || !productId) {
    return null;
  }

  const sections = getSections(document);

  for (const section of sections || []) {
    if (section._type === 'relatedProductsSection') {
      promise = storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
        variables: {
          count: section.maxProducts || 6,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
          productId,
        },
      });
    }
  }

  return promise || null;
}

async function resolveCollectionProductGridPromise({
  collectionId,
  document,
  request,
  storefront,
}: PromiseResolverArgs) {
  let promise;

  if (document.data?._type !== 'collection' || !collectionId) {
    return null;
  }

  const sections = getSections(document);
  const searchParams = new URL(request.url).searchParams;
  const {filters, reverse, sortKey} = getFiltersFromParam(searchParams);

  for (const section of sections || []) {
    if (section._type === 'collectionProductGridSection') {
      const paginationVariables = getPaginationVariables(request, {
        pageBy: section.productsPerPage || 8,
      });

      promise = storefront.query(COLLECTION_PRODUCT_GRID_QUERY, {
        variables: {
          ...paginationVariables,
          country: storefront.i18n.country,
          filters,
          id: collectionId,
          language: storefront.i18n.language,
          reverse,
          sortKey,
        },
      });
    }
  }

  return promise || null;
}
