import type {TypeFromSelection} from 'groqd';
import type {ProductCardFragment} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {FEATURED_COLLECTION_SECTION_FRAGMENT} from '~/qroq/sections';

import type {loader as indexLoader} from '../../routes/_index';

import {ProductCardGrid} from '../product/ProductCardGrid';

type FeaturedCollectionSectionProps = TypeFromSelection<
  typeof FEATURED_COLLECTION_SECTION_FRAGMENT
>;

/**
 * `FeaturedCollectionSection` is a section that displays a collection of products.
 * The collection data is fetched from Shopify using the `featuredCollectionPromise`
 * returned by the loader. The data is streamed to the client so we need to use a `Suspense`
 * component and to display a `Skeleton` while waiting for the data to be available.
 */
export function FeaturedCollectionSection(
  props: SectionDefaultProps & {data: FeaturedCollectionSectionProps},
) {
  return (
    <div className="container">
      <h2>{props.data.collection?.store.title}</h2>
      <AwaitFeaturedCollection
        fallback={
          <Skeleton
            cardsNumber={props.data.maxProducts || 3}
            columns={props.data.desktopColumns || 3}
          />
        }
        sanityData={props.data}
      >
        {(products) => (
          <ProductCardGrid
            columns={{
              desktop: props.data.desktopColumns,
            }}
            products={products}
          />
        )}
      </AwaitFeaturedCollection>
    </div>
  );
}

function Skeleton(props: {cardsNumber: number; columns: number}) {
  return (
    <div aria-hidden className="animate-pulse">
      <ProductCardGrid
        columns={{
          desktop: props.columns,
        }}
        skeleton={{
          cardsNumber: props.cardsNumber,
        }}
      />
    </div>
  );
}

function AwaitFeaturedCollection(props: {
  children: (products: ProductCardFragment[]) => React.ReactNode;
  fallback: React.ReactNode;
  sanityData: FeaturedCollectionSectionProps;
}) {
  const loaderData = useLoaderData<typeof indexLoader>();
  const featuredCollectionPromise = loaderData?.featuredCollectionPromise;
  const sanityCollectionGid = props.sanityData?.collection?.store.gid;

  if (!featuredCollectionPromise) {
    console.warn(
      '[FeaturedCollectionSection] No featuredCollectionPromise found in loader data.',
    );
  }

  return featuredCollectionPromise ? (
    <Suspense fallback={props.fallback}>
      <Await
        // Todo => Add an error component
        errorElement={<div>Error</div>}
        resolve={featuredCollectionPromise}
      >
        {(data) => {
          // Resolve the collection data from Shopify with the gid from Sanity
          const collection = data.map((result) => {
            // Check if the promise is fulfilled
            if (result.status === 'fulfilled') {
              const {collection} = result.value;
              // Check if the gid from Sanity is the same as the gid from Shopify
              if (sanityCollectionGid?.includes(collection?.id!)) {
                return collection;
              }
            }
            // Todo => Return error component if the promise is rejected
            return null;
          })[0];

          const products =
            collection?.products?.nodes && collection?.products?.nodes?.length
              ? flattenConnection(collection?.products)
              : [];

          return <>{products && props.children(products)}</>;
        }}
      </Await>
    </Suspense>
  ) : null;
}
