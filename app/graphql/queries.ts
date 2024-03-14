import {
  IMAGE_FRAGMENT,
  MEDIA_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
} from './fragments';

/*
|--------------------------------------------------------------------------
| Products Queries
|--------------------------------------------------------------------------
*/
export const PRODUCT_QUERY = `#graphql
query Product(
  $country: CountryCode
  $language: LanguageCode
  $handle: String!
) @inContext(country: $country, language: $language) {
  product(handle: $handle) {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    media(first: 7) {
      nodes {
        ...Media
      }
    }
    variants(first: 1) {
      nodes {
        ...ProductVariantFragment
      }
    }
    seo {
      description
      title
    }
  }
}
${MEDIA_FRAGMENT}
${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const FEATURED_PRODUCT_QUERY = `#graphql
query FeaturedProduct(
  $country: CountryCode
  $language: LanguageCode
  $id: ID!
) @inContext(country: $country, language: $language) {
  product(id: $id) {
    id
    title
    vendor
    handle
    descriptionHtml
    options {
      name
      values
    }
    # There is a lot of variants to fetch but this query is deferred
    # so it won't block the main page from loading.
    variants(first: 250) {
      nodes {
        ...ProductVariantFragment
      }
    }
  }
}
${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $count: Int
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    mainProduct: product(id: $productId) {
      id
    }
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/*
|--------------------------------------------------------------------------
| Variants Queries
|--------------------------------------------------------------------------
*/
export const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

/*
|--------------------------------------------------------------------------
| Collections Queries
|--------------------------------------------------------------------------
*/
export const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $query: String
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query) {
      nodes {
        id
        title
        description
        handle
        seo {
          description
          title
        }
        image {
          ...ImageFragment
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...ImageFragment
      }
      seo {
        description
        title
      }
      products(first: 10) {
        nodes {
          handle
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
` as const;

export const COLLECTION_PRODUCT_GRID_QUERY = `#graphql
  query CollectionProductGrid(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      id
      handle
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const FEATURED_COLLECTION_QUERY = `#graphql
  query FeaturedCollection(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      id
      handle
      title
      description
      image {
        ...ImageFragment
      }
      products(
        first: $first,
      ) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
` as const;
