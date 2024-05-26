import type {TypeFromSelection} from 'groqd';
import type {
  FeaturedCollectionQuery,
  ProductCardFragment,
} from 'storefrontapi.generated';

import {Await, Link, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {FEATURED_COLLECTION_SECTION_FRAGMENT} from '~/qroq/sections';

import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

import type {loader as indexLoader} from '../../routes/_index';

import {Skeleton} from '../Skeleton';
import {ProductCardGrid} from '../product/ProductCardGrid';
import {Button} from '../ui/Button';

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
  props: {data: FeaturedCollectionSectionProps} & SectionDefaultProps,
) {
  const collectionHandle = useLocalePath({
    path: `/collections/${props.data.collection?.store.slug?.current}`,
  });
  const {themeContent} = useSanityThemeContent();

  return (
    <div className="container space-y-4">
      <div className="flex justify-between">
        <h2>{props.data.heading || props.data.collection?.store.title}</h2>
        {props.data.viewAll && (
          <Button asChild className="hidden md:inline-flex" variant="ghost">
            <Link to={collectionHandle}>
              {themeContent?.collection?.viewAll}
            </Link>
          </Button>
        )}
      </div>
      <AwaitFeaturedCollection
        error={
          <Skeleton isError>
            <div aria-hidden className="animate-pulse">
              <ProductCardGrid
                columns={{
                  desktop: props.data.maxProducts || 3,
                }}
                skeleton={{
                  cardsNumber: props.data.desktopColumns || 3,
                }}
              />
            </div>
          </Skeleton>
        }
        fallback={
          <Skeleton>
            <div aria-hidden className="animate-pulse">
              <ProductCardGrid
                columns={{
                  desktop: props.data.maxProducts || 3,
                }}
                skeleton={{
                  cardsNumber: props.data.desktopColumns || 3,
                }}
              />
            </div>
          </Skeleton>
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
      {props.data.viewAll && (
        <div className="flex justify-center md:hidden">
          <Button asChild variant="ghost">
            <Link to={collectionHandle}>
              {themeContent?.collection?.viewAll}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function AwaitFeaturedCollection(props: {
  children: (products: ProductCardFragment[]) => React.ReactNode;
  error: React.ReactNode;
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
    return null;
  }

  return (
    <Suspense fallback={props.fallback}>
      <Await errorElement={props.error} resolve={featuredCollectionPromise}>
        {(data) => {
          // Resolve the collection data from Shopify with the gid from Sanity
          let collection:
            | NonNullable<FeaturedCollectionQuery['collection']>
            | null
            | undefined;

          for (const result of data) {
            if (result.status === 'fulfilled') {
              const {collection: resultCollection} = result.value;
              // Check if the gid from Sanity is the same as the gid from Shopify
              if (sanityCollectionGid === resultCollection?.id!) {
                collection = resultCollection;
                break;
              }
            } else if (result.status === 'rejected') {
              return props.error;
            }
          }

          const products =
            collection?.products?.nodes && collection?.products?.nodes?.length
              ? flattenConnection(collection?.products)
              : [];

          return <>{products && props.children(products)}</>;
        }}
      </Await>
    </Suspense>
  );
}
