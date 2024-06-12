import type {SeoConfig} from '@shopify/hydrogen';
import type {
  Article,
  Blog,
  Collection,
  Image,
  Page,
  Product,
  ProductVariant,
  ShopPolicy,
} from '@shopify/hydrogen/storefront-api-types';
import type {InferType, TypeFromSelection} from 'groqd';
import type {BreadcrumbList, CollectionPage, Offer} from 'schema-dts';

import {getImageDimensions} from '@sanity/asset-utils';
import {stegaClean} from '@sanity/client/stega';

import type {IMAGE_FRAGMENT as SANITY_IMAGE_FRAGMENT} from '~/qroq/fragments';
import type {PAGE_QUERY, ROOT_QUERY} from '~/qroq/queries';

import {generateSanityImageUrl} from '~/components/sanity/SanityImage';

type SanityConfig = {
  dataset: string;
  projectId: string;
};

function root({
  root,
  sanity,
  url,
}: {
  root: InferType<typeof ROOT_QUERY>;
  sanity: SanityConfig;
  url: Request['url'];
}): SeoConfig {
  const settings = root?.settings;
  const media = generateOGImageData({
    image: settings?.socialSharingImagePreview,
    sanity,
  });
  const logoWidth = settings?.logo
    ? getImageDimensions(settings.logo._ref).width
    : 0;
  const logoUrl = generateSanityImageUrl({
    dataset: sanity.dataset,
    projectId: sanity.projectId,
    ref: settings?.logo?._ref,
    width: logoWidth,
  });

  return {
    description: truncate(settings?.description ?? ''),
    handle: extractTwitterHandle(settings?.twitter ?? ''),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      logo: logoUrl || undefined,
      name: settings?.siteName ?? '',
      // Todo => Add search to schema
      // potentialAction: {
      //   '@type': 'SearchAction',
      //   query: "required name='search_term'",
      //   target: `${url}search?q={search_term}`,
      // },
      sameAs: [
        root?.settings?.facebook ?? '',
        root?.settings?.instagram ?? '',
        root?.settings?.twitter ?? '',
        root?.settings?.youtube ?? '',
        root?.settings?.tiktok ?? '',
        root?.settings?.snapchat ?? '',
        root?.settings?.pinterest ?? '',
        root?.settings?.tumblr ?? '',
        root?.settings?.vimeo ?? '',
        root?.settings?.linkedin ?? '',
      ],
      url,
    },
    media,
    robots: {
      noFollow: false,
      noIndex: false,
    },
    title: settings?.siteName,
    titleTemplate: `%s | ${root?.settings?.siteName}`,
    url,
  };
}

function home({
  page,
  sanity,
}: {
  page: InferType<typeof PAGE_QUERY>;
  sanity: SanityConfig;
}): SeoConfig {
  const media = generateOGImageData({
    image: page?.seo?.image,
    sanity,
  });
  return {
    description: page?.seo?.description ?? '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Home page',
    },
    media,
    robots: {
      noFollow: false,
      noIndex: false,
    },
    title: page?.seo?.title ?? '',
  };
}

type SelectedVariantRequiredFields = {
  image?: Partial<Image> | null;
} & Pick<ProductVariant, 'sku'>;

type ProductRequiredFields = {
  variants: {
    nodes: Array<
      Pick<
        ProductVariant,
        'availableForSale' | 'price' | 'selectedOptions' | 'sku'
      >
    >;
  };
} & Pick<Product, 'description' | 'seo' | 'title' | 'vendor'>;

function productJsonLd({
  product,
  selectedVariant,
  url,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
}): SeoConfig['jsonLd'] {
  const origin = new URL(url).origin;
  const variants = product.variants.nodes;
  const description = truncate(
    product?.seo?.description ?? product?.description,
  );
  const offers: Offer[] = (variants || []).map((variant) => {
    const variantUrl = new URL(url);
    for (const option of variant.selectedOptions) {
      variantUrl.searchParams.set(option.name, option.value);
    }
    const availability = variant.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

    return {
      '@type': 'Offer',
      availability,
      price: parseFloat(variant.price.amount),
      priceCurrency: variant.price.currencyCode,
      sku: variant?.sku ?? '',
      url: variantUrl.toString(),
    };
  });
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          item: `${origin}/products`,
          name: 'Products',
          position: 1,
        },
        {
          '@type': 'ListItem',
          name: product.title,
          position: 2,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: product.vendor,
      },
      description,
      image: [selectedVariant?.image?.url ?? ''],
      name: product.title,
      offers,
      sku: selectedVariant?.sku ?? '',
      url,
    },
  ];
}

function product({
  product,
  selectedVariant,
  url,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
}): SeoConfig {
  const description = truncate(
    product?.seo?.description ?? product?.description ?? '',
  );
  return {
    description,
    jsonLd: productJsonLd({product, selectedVariant, url}),
    media: selectedVariant?.image,
    title: product?.seo?.title ?? product?.title,
  };
}

type CollectionRequiredFields = {
  descriptionHtml?: Collection['descriptionHtml'] | null;
  image?: Pick<Image, 'altText' | 'height' | 'url' | 'width'> | null;
  metafields?: Collection['metafields'] | null;
  products: {nodes: Pick<Product, 'handle'>[]};
  updatedAt?: Collection['updatedAt'] | null;
} & Omit<
  Collection,
  'descriptionHtml' | 'image' | 'metafields' | 'products' | 'updatedAt'
>;

function collectionJsonLd({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request['url'];
}): SeoConfig['jsonLd'] {
  const siteUrl = new URL(url);
  const itemListElement: CollectionPage['mainEntity'] =
    collection.products.nodes.map((product, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/products/${product.handle}`,
      };
    });

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          item: `${siteUrl.host}/collections`,
          name: 'Collections',
          position: 1,
        },
        {
          '@type': 'ListItem',
          name: collection.title,
          position: 2,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      description: truncate(
        collection?.seo?.description ?? collection?.description ?? '',
      ),
      image: collection?.image?.url,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement,
      },
      name: collection?.seo?.title ?? collection?.title ?? '',
      url: `/collections/${collection.handle}`,
    },
  ];
}

function collection({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(
      collection?.seo?.description ?? collection?.description ?? '',
    ),
    jsonLd: collectionJsonLd({collection, url}),
    media: {
      altText: collection?.image?.altText,
      height: collection?.image?.height,
      type: 'image',
      url: collection?.image?.url,
      width: collection?.image?.width,
    },
    title: collection?.seo?.title ?? collection?.title,
    titleTemplate: '%s | Collection',
  };
}

type CollectionListRequiredFields = {
  nodes: Omit<CollectionRequiredFields, 'products'>[];
};

function collectionsJsonLd({
  collections,
  url,
}: {
  collections: CollectionListRequiredFields;
  url: Request['url'];
}): SeoConfig['jsonLd'] {
  const itemListElement: CollectionPage['mainEntity'] = collections.nodes.map(
    (collection, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/collections/${collection.handle}`,
      };
    },
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    description: 'All collections',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
    },
    name: 'Collections',
    url,
  };
}

function listCollections({
  collections,
  url,
}: {
  collections: CollectionListRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    description: 'All hydrogen collections',
    jsonLd: collectionsJsonLd({collections, url}),
    title: 'All collections',
    titleTemplate: '%s | Collections',
    url,
  };
}

function article({
  article,
  url,
}: {
  article: {
    image?: Pick<
      NonNullable<Article['image']>,
      'altText' | 'height' | 'url' | 'width'
    > | null;
  } & Pick<
    Article,
    'contentHtml' | 'excerpt' | 'publishedAt' | 'seo' | 'title'
  >;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(article?.seo?.description ?? ''),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      alternativeHeadline: article.title,
      articleBody: article.contentHtml,
      datePublished: article?.publishedAt,
      description: truncate(
        article?.seo?.description || article?.excerpt || '',
      ),
      headline: article?.seo?.title || '',
      image: article?.image?.url,
      url,
    },
    media: {
      altText: article?.image?.altText,
      height: article?.image?.height,
      type: 'image',
      url: article?.image?.url,
      width: article?.image?.width,
    },
    title: article?.seo?.title ?? article?.title,
    titleTemplate: '%s | Journal',
    url,
  };
}

function blog({
  blog,
  url,
}: {
  blog: Pick<Blog, 'seo' | 'title'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(blog?.seo?.description || ''),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      description: blog?.seo?.description || '',
      name: blog?.seo?.title || blog?.title || '',
      url,
    },
    title: blog?.seo?.title,
    titleTemplate: '%s | Blog',
    url,
  };
}

function page({
  page,
  url,
}: {
  page: Pick<Page, 'seo' | 'title'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(page?.seo?.description || ''),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
    },
    title: page?.seo?.title ?? page?.title,
    titleTemplate: '%s | Page',
    url,
  };
}

function policy({
  policy,
  url,
}: {
  policy: Pick<ShopPolicy, 'body' | 'title'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(policy?.body ?? ''),
    title: policy?.title,
    titleTemplate: '%s | Policy',
    url,
  };
}

function policies({
  policies,
  url,
}: {
  policies: Array<Pick<ShopPolicy, 'handle' | 'title'>>;
  url: Request['url'];
}): SeoConfig {
  const origin = new URL(url).origin;
  const itemListElement: BreadcrumbList['itemListElement'] = policies
    .filter(Boolean)
    .map((policy, index) => {
      return {
        '@type': 'ListItem',
        item: `${origin}/policies/${policy.handle}`,
        name: policy.title,
        position: index + 1,
      };
    });
  return {
    description: 'Hydroge store policies',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        description: 'Hydrogen store policies',
        name: 'Policies',
        url,
      },
    ],
    title: 'Policies',
    titleTemplate: '%s | Policies',
  };
}

export const seoPayload = {
  article,
  blog,
  collection,
  home,
  listCollections,
  page,
  policies,
  policy,
  product,
  root,
};

/**
 * Truncate a string to a given length, adding an ellipsis if it was truncated
 * @param str - The string to truncate
 * @param num - The maximum length of the string
 * @returns The truncated string
 * @example
 * ```js
 * truncate('Hello world', 5) // 'Hello...'
 * ```
 */
function truncate(str: string, num = 155): string {
  if (typeof str !== 'string') return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - 3) + '...';
}

function generateOGImageData({
  image,
  sanity,
}: {
  image?: TypeFromSelection<typeof SANITY_IMAGE_FRAGMENT> | null;
  sanity: SanityConfig;
}): SeoConfig['media'] {
  if (!image) {
    return undefined;
  }

  const socialImage = stegaClean(image);

  const size = {
    height: 628,
    width: 1200,
  };

  const url = generateSanityImageUrl({
    dataset: sanity.dataset,
    height: size.height,
    projectId: sanity.projectId,
    ref: socialImage?._ref,
    width: size.width,
  });

  return {url, ...size, altText: socialImage?.altText ?? '', type: 'image'};
}
function extractTwitterHandle(twitterUrl: string): null | string {
  // Check if the URL is valid
  const urlRegex =
    /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)(?:\/)?$/;
  const match = twitterUrl.match(urlRegex);

  if (match && match.length === 2) {
    return `@${match[1]}`; // Prefix with "@"
  } else {
    return null; // URL does not match the expected pattern
  }
}
