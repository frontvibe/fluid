import type {TypeFromSelection} from 'groqd';
import type {FeaturedProductQuery} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {Image, Money, flattenConnection} from '@shopify/hydrogen';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {FEATURED_PRODUCT_SECTION_FRAGMENT} from '~/qroq/sections';

import type {loader as indexLoader} from '../../routes/_index';

type FeaturedProductSectionProps = TypeFromSelection<
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

          return (
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                {firstAvailableVariant?.image && (
                  <Image
                    aspectRatio="1/1"
                    className="h-full w-full rounded object-cover"
                    data={firstAvailableVariant.image}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                )}
              </div>
              <div>
                <h2>{product.title}</h2>
                <div>
                  {firstAvailableVariant?.price && (
                    <Money data={firstAvailableVariant.price} />
                  )}
                </div>
              </div>
            </div>
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
  }

  return featuredProductPromise ? (
    <Suspense fallback={props.fallback}>
      <Await
        // Todo => Add an error component
        errorElement={<div>Error</div>}
        resolve={featuredProductPromise}
      >
        {(data) => {
          // Resolve the collection data from Shopify with the gid from Sanity
          const product = data.map((result) => {
            // Check if the promise is fulfilled
            if (result.status === 'fulfilled') {
              const {product} = result.value;
              // Check if the gid from Sanity is the same as the gid from Shopify
              if (sanityProductGid?.includes(product?.id!)) {
                return product;
              }
            }
            // Todo => Return error component if the promise is rejected
            return null;
          })[0];

          return <>{product && props.children(product)}</>;
        }}
      </Await>
    </Suspense>
  ) : null;
}
