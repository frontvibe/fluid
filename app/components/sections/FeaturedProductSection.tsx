import type {ProductVariantConnection} from '@shopify/hydrogen/storefront-api-types';
import type {TypeFromSelection} from 'groqd';
import type {FeaturedProductQuery} from 'storefrontapi.generated';
import type {PartialObjectDeep} from 'type-fest/source/partial-deep';

import {Await, useLoaderData} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';
import {flattenConnection} from '@shopify/hydrogen';
import {ProductProvider} from '@shopify/hydrogen-react';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {AspectRatioData} from '~/lib/utils';
import type {FEATURED_PRODUCT_SECTION_FRAGMENT} from '~/qroq/sections';

import {
  cn,
  generateShopifyImageThumbnail,
  getAspectRatioData,
} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

import type {loader as indexLoader} from '../../routes/_index';

import {ShopifyImage} from '../ShopifyImage';
import {Skeleton} from '../Skeleton';
import {ProductDetails} from '../product/ProductDetails';

export type FeaturedProductSectionProps = TypeFromSelection<
  typeof FEATURED_PRODUCT_SECTION_FRAGMENT
>;

/**
 * `FeaturedProductSection` is a section that displays a product.
 * The product data is fetched from Shopify using the `featuredProductPromise`
 * returned by the loader. The data is streamed to the client so we need to use a `Suspense`
 * component and to display a `Skeleton` while waiting for the data to be available.
 */
export function FeaturedProductSection(
  props: {data: FeaturedProductSectionProps} & SectionDefaultProps,
) {
  const aspectRatio = getAspectRatioData(props.data.mediaAspectRatio);
  return (
    <div className="container">
      <AwaitFeaturedProduct
        error={
          <FeaturedProductSkeleton
            data={props.data}
            imageAspectRatio={aspectRatio}
            isError
          />
        }
        fallback={
          <FeaturedProductSkeleton
            data={props.data}
            imageAspectRatio={aspectRatio}
          />
        }
        sanityData={props.data}
      >
        {(product) => {
          const variants = product.variants.nodes.length
            ? flattenConnection(product.variants)
            : [];
          const firstAvailableVariant = variants.find(
            (variant) => variant.availableForSale,
          );
          const image = firstAvailableVariant?.image;

          return (
            <ProductProvider data={product}>
              <Grid>
                <div>
                  {image && (
                    <ShopifyImage
                      aspectRatio={aspectRatio.value}
                      className={cn(
                        'h-auto object-cover',
                        aspectRatio.className,
                      )}
                      data={image}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  )}
                </div>
                <div>
                  <ProductDetails data={props.data} />
                </div>
              </Grid>
            </ProductProvider>
          );
        }}
      </AwaitFeaturedProduct>
    </div>
  );
}

function Grid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-10 lg:grid-cols-2', className)}>
      {children}
    </div>
  );
}

function FeaturedProductSkeleton({
  data,
  imageAspectRatio,
  isError,
}: {
  data: FeaturedProductSectionProps;
  imageAspectRatio: AspectRatioData;
  isError?: true;
}) {
  const {locale} = useRootLoaderData();
  const sanityProduct = stegaClean(data.product?.store);
  const variants: PartialObjectDeep<
    ProductVariantConnection,
    {recurseIntoArrays: true}
  > = {
    nodes: [],
  };
  const imageUrl =
    sanityProduct?.firstVariant?.store.previewImageUrl ||
    sanityProduct?.previewImageUrl;
  const thumbnailUrl = generateShopifyImageThumbnail(imageUrl);

  // While waiting for Shopify data, we render a skeleton filled with sanity data
  if (sanityProduct) {
    variants.nodes?.push({
      id: sanityProduct.firstVariant?.store.gid,
      price: {
        amount: sanityProduct?.firstVariant?.store.price.toString() || '0',
        currencyCode: locale.currency,
      },
      selectedOptions: [],
    });
  }

  return (
    <Skeleton isError={isError}>
      <Grid>
        <div>
          {imageUrl && thumbnailUrl && (
            <ShopifyImage
              aspectRatio={imageAspectRatio.value}
              className={cn('h-auto object-cover', imageAspectRatio.className)}
              data={{
                id: data.product?.store.gid,
                url: imageUrl,
              }}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          )}
        </div>
        <div>
          <ProductProvider
            data={{
              descriptionHtml: sanityProduct?.descriptionHtml,
              id: sanityProduct?.gid,
              options: sanityProduct?.options || [],
              title: sanityProduct?.title,
              variants,
            }}
          >
            <ProductDetails data={data} />
          </ProductProvider>
        </div>
      </Grid>
    </Skeleton>
  );
}

function AwaitFeaturedProduct(props: {
  children: (
    product: NonNullable<FeaturedProductQuery['product']>,
  ) => React.ReactNode;
  error: React.ReactNode;
  fallback: React.ReactNode;
  sanityData: FeaturedProductSectionProps;
}) {
  const loaderData = useLoaderData<typeof indexLoader>();
  const featuredProductPromise = loaderData?.featuredProductPromise;
  const sanityProductGid = props.sanityData?.product?.store.gid;

  if (!featuredProductPromise) {
    console.warn(
      '[FeaturedProductSection] No featuredProductPromise found in loader data.',
    );
    return null;
  }

  return (
    <Suspense fallback={props.fallback}>
      <Await errorElement={props.error} resolve={featuredProductPromise}>
        {(data) => {
          // Resolve the collection data from Shopify with the gid from Sanity
          let product:
            | NonNullable<FeaturedProductQuery['product']>
            | null
            | undefined;

          for (const result of data) {
            if (result.status === 'fulfilled') {
              const {product: resultProduct} = result.value;
              // Check if the gid from Sanity is the same as the gid from Shopify
              if (resultProduct?.id === sanityProductGid) {
                product = resultProduct;
                break;
              }
            } else if (result.status === 'rejected') {
              return props.error;
            }
          }

          return <>{product && props.children(product)}</>;
        }}
      </Await>
    </Suspense>
  );
}
