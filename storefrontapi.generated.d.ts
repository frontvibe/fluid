/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

type Media_ExternalVideo_Fragment = {__typename: 'ExternalVideo'} & Pick<
  StorefrontAPI.ExternalVideo,
  'id' | 'embedUrl' | 'host' | 'mediaContentType' | 'alt'
> & {previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>};

type Media_MediaImage_Fragment = {__typename: 'MediaImage'} & Pick<
  StorefrontAPI.MediaImage,
  'id' | 'mediaContentType' | 'alt'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'width' | 'height'>
    >;
    previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
  };

type Media_Model3d_Fragment = {__typename: 'Model3d'} & Pick<
  StorefrontAPI.Model3d,
  'id' | 'mediaContentType' | 'alt'
> & {
    sources: Array<Pick<StorefrontAPI.Model3dSource, 'mimeType' | 'url'>>;
    previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
  };

type Media_Video_Fragment = {__typename: 'Video'} & Pick<
  StorefrontAPI.Video,
  'id' | 'mediaContentType' | 'alt'
> & {
    sources: Array<Pick<StorefrontAPI.VideoSource, 'mimeType' | 'url'>>;
    previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
  };

export type MediaFragment =
  | Media_ExternalVideo_Fragment
  | Media_MediaImage_Fragment
  | Media_Model3d_Fragment
  | Media_Video_Fragment;

export type ProductVariantFragmentFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'availableForSale' | 'sku' | 'title'
> & {
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
};

export type ProductCardFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'publishedAt' | 'handle' | 'vendor'
> & {
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
      }
    >;
  };
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
        attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
        cost: {
          totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          amountPerQuantity: Pick<
            StorefrontAPI.MoneyV2,
            'currencyCode' | 'amount'
          >;
          compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
        };
        merchandise: Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'availableForSale' | 'requiresShipping' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
        };
      }
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type FeaturedCollectionDetailsFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'width' | 'height' | 'url'>
  >;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'vendor' | 'handle' | 'descriptionHtml' | 'description'
    > & {
      options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      media: {
        nodes: Array<
          | ({__typename: 'ExternalVideo'} & Pick<
              StorefrontAPI.ExternalVideo,
              'id' | 'embedUrl' | 'host' | 'mediaContentType' | 'alt'
            > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              })
          | ({__typename: 'MediaImage'} & Pick<
              StorefrontAPI.MediaImage,
              'id' | 'mediaContentType' | 'alt'
            > & {
                image?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'id' | 'url' | 'width' | 'height'>
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              })
          | ({__typename: 'Model3d'} & Pick<
              StorefrontAPI.Model3d,
              'id' | 'mediaContentType' | 'alt'
            > & {
                sources: Array<
                  Pick<StorefrontAPI.Model3dSource, 'mimeType' | 'url'>
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              })
          | ({__typename: 'Video'} & Pick<
              StorefrontAPI.Video,
              'id' | 'mediaContentType' | 'alt'
            > & {
                sources: Array<
                  Pick<StorefrontAPI.VideoSource, 'mimeType' | 'url'>
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              })
        >;
      };
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'sku' | 'title'
          > & {
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          }
        >;
      };
    }
  >;
};

export type FeaturedProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  id: StorefrontAPI.Scalars['ID']['input'];
}>;

export type FeaturedProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'vendor' | 'handle' | 'descriptionHtml'
    > & {
      options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'sku' | 'title'
          > & {
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          }
        >;
      };
    }
  >;
};

export type ProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  count?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  productId: StorefrontAPI.Scalars['ID']['input'];
}>;

export type ProductRecommendationsQuery = {
  mainProduct?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Product, 'id'>>;
  recommended?: StorefrontAPI.Maybe<
    Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'publishedAt' | 'handle' | 'vendor'
      > & {
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
      }
    >
  >;
  additional: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'publishedAt' | 'handle' | 'vendor'
      > & {
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
      }
    >;
  };
};

export type AllProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type AllProductsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'publishedAt' | 'handle' | 'vendor'
      > & {
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type VariantsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type VariantsQuery = {
  product?: StorefrontAPI.Maybe<{
    variants: {
      nodes: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'availableForSale' | 'sku' | 'title'
        > & {
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
        }
      >;
    };
  }>;
};

export type CollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  query?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'description' | 'handle'
      > & {
        seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'width' | 'height' | 'altText'
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type CollectionDetailsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CollectionDetailsQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'width' | 'height' | 'altText'>
      >;
    }
  >;
};

export type CollectionProductGridQueryVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey: StorefrontAPI.ProductCollectionSortKeys;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionProductGridQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'handle'> & {
      products: {
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              >
            >;
          }
        >;
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'title' | 'publishedAt' | 'handle' | 'vendor'
          > & {
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type FeaturedCollectionQueryVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
}>;

export type FeaturedCollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'width' | 'height' | 'altText'>
      >;
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'title' | 'publishedAt' | 'handle' | 'vendor'
          > & {
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
          }
        >;
      };
    }
  >;
};

interface GeneratedQueryTypes {
  '#graphql\nquery Product(\n  $country: CountryCode\n  $language: LanguageCode\n  $handle: String!\n) @inContext(country: $country, language: $language) {\n  product(handle: $handle) {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    options {\n      name\n      values\n    }\n    media(first: 7) {\n      nodes {\n        ...Media\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariantFragment\n      }\n    }\n  }\n}\n#graphql\n  fragment Media on Media {\n    __typename\n    mediaContentType\n    alt\n    previewImage {\n      url\n    }\n    ... on MediaImage {\n      id\n      image {\n        id\n        url\n        width\n        height\n      }\n    }\n    ... on Video {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on Model3d {\n      id\n      sources {\n        mimeType\n        url\n      }\n    }\n    ... on ExternalVideo {\n      id\n      embedUrl\n      host\n    }\n  }\n\n#graphql\n  fragment ProductVariantFragment on ProductVariant {\n    id\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n  }\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  "#graphql\nquery FeaturedProduct(\n  $country: CountryCode\n  $language: LanguageCode\n  $id: ID!\n) @inContext(country: $country, language: $language) {\n  product(id: $id) {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    options {\n      name\n      values\n    }\n    # There is a lot of variants to fetch but this query is deferred\n    # so it won't block the main page from loading.\n    variants(first: 250) {\n      nodes {\n        ...ProductVariantFragment\n      }\n    }\n  }\n}\n#graphql\n  fragment ProductVariantFragment on ProductVariant {\n    id\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n  }\n\n": {
    return: FeaturedProductQuery;
    variables: FeaturedProductQueryVariables;
  };
  '#graphql\n  query productRecommendations(\n    $count: Int\n    $country: CountryCode\n    $language: LanguageCode\n    $productId: ID!\n  ) @inContext(country: $country, language: $language) {\n    mainProduct: product(id: $productId) {\n      id\n    }\n    recommended: productRecommendations(productId: $productId) {\n      ...ProductCard\n    }\n    additional: products(first: $count, sortKey: BEST_SELLING) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    variants(first: 1) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n': {
    return: ProductRecommendationsQuery;
    variables: ProductRecommendationsQueryVariables;
  };
  '#graphql\n  query AllProducts(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes {\n        ...ProductCard\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    variants(first: 1) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n': {
    return: AllProductsQuery;
    variables: AllProductsQueryVariables;
  };
  '#graphql\n  query variants(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      variants(first: 250) {\n        nodes {\n          ...ProductVariantFragment\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariantFragment on ProductVariant {\n    id\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n  }\n\n': {
    return: VariantsQuery;
    variables: VariantsQueryVariables;
  };
  '#graphql\n  query Collections(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $query: String\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query) {\n      nodes {\n        id\n        title\n        description\n        handle\n        seo {\n          description\n          title\n        }\n        image {\n          id\n          url\n          width\n          height\n          altText\n        }\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: CollectionsQuery;
    variables: CollectionsQueryVariables;
  };
  '#graphql\n  query CollectionDetails(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      image {\n        id\n        url\n        width\n        height\n        altText\n      }\n    }\n  }\n': {
    return: CollectionDetailsQuery;
    variables: CollectionDetailsQueryVariables;
  };
  '#graphql\n  query CollectionProductGrid(\n    $id: ID!\n    $country: CountryCode\n    $language: LanguageCode\n    $filters: [ProductFilter!]\n    $sortKey: ProductCollectionSortKeys!\n    $reverse: Boolean\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(id: $id) {\n      id\n      handle\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        filters: $filters,\n        sortKey: $sortKey,\n        reverse: $reverse\n      ) {\n        filters {\n          id\n          label\n          type\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n        nodes {\n          ...ProductCard\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    variants(first: 1) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n': {
    return: CollectionProductGridQuery;
    variables: CollectionProductGridQueryVariables;
  };
  '#graphql\n  query FeaturedCollection(\n    $id: ID!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n  ) @inContext(country: $country, language: $language) {\n    collection(id: $id) {\n      id\n      handle\n      title\n      description\n      image {\n        id\n        url\n        width\n        height\n        altText\n      }\n      products(\n        first: $first,\n      ) {\n        nodes {\n          ...ProductCard\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    variants(first: 1) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n': {
    return: FeaturedCollectionQuery;
    variables: FeaturedCollectionQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
