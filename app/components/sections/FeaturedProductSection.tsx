import type {TypeFromSelection} from 'groqd';
import type {FeaturedProductQuery} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {ProductProvider} from '@shopify/hydrogen-react';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {FEATURED_PRODUCT_SECTION_FRAGMENT} from '~/qroq/sections';

import type {loader as indexLoader} from '../../routes/_index';

import {ShopifyImage} from '../ShopifyImage';
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
  props: SectionDefaultProps & {data: FeaturedProductSectionProps},
) {
  return (
    <div className="container">
      <AwaitFeaturedProduct
        fallback={
          // Todo => Add a skeleton
          <div className="h-96" />
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

          // Todo => Add section settings to choose the aspect ratio (16/9, 1/1, are the original aspect ratio)
          return (
            <ProductProvider data={product}>
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  {image && (
                    <ShopifyImage
                      className="h-auto w-full object-cover"
                      data={image}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  )}
                </div>
                <div>
                  <ProductDetails data={props.data} />
                </div>
              </div>
            </ProductProvider>
          );
        }}
      </AwaitFeaturedProduct>
    </div>
  );
}

function AwaitFeaturedProduct(props: {
  children: (
    product: NonNullable<FeaturedProductQuery['product']>,
  ) => React.ReactNode;
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
      <Await
        // Todo => Add an error component
        errorElement={<div>Error</div>}
        resolve={featuredProductPromise}
      >
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
            }
            // Todo => Return error component if the promise is rejected
          }

          return <>{product && props.children(product)}</>;
        }}
      </Await>
    </Suspense>
  );
}
