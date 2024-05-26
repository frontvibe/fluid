import type {TypeFromSelection} from 'groqd';
import type {CollectionsQuery} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {COLLECTION_LIST_SECTION_FRAGMENT} from '~/qroq/sections';

import type {loader as indexLoader} from '../../routes/_index';

import {CollectionListGrid} from '../CollectionListGrid';
import {Skeleton} from '../Skeleton';

type CollectionListSectionProps = TypeFromSelection<
  typeof COLLECTION_LIST_SECTION_FRAGMENT
>;

/**
 * `CollectionListSection` is a section that displays a list of collections.
 * The collections data is fetched from Shopify using the `collectionListPromise`
 * returned by the loader. The data is streamed to the client so we need to use a `Suspense`
 * component and to display a `Skeleton` while waiting for the data to be available.
 */
export function CollectionListSection(
  props: {data: CollectionListSectionProps} & SectionDefaultProps,
) {
  return (
    <AwaitCollectionList
      error={
        <Skeleton isError>
          <div className="container">
            <CollectionListGrid
              columns={props.data.collections?.length || 2}
              skeleton={{
                cardsNumber: props.data.desktopColumns || 2,
              }}
            />
          </div>
        </Skeleton>
      }
      fallback={
        <Skeleton>
          <div className="container">
            <CollectionListGrid
              columns={props.data.collections?.length || 2}
              skeleton={{
                cardsNumber: props.data.desktopColumns || 2,
              }}
            />
          </div>
        </Skeleton>
      }
      sanityData={props.data}
    >
      {(collections) => (
        <div className="container">
          <CollectionListGrid
            collections={collections}
            columns={props.data.desktopColumns}
          />
        </div>
      )}
    </AwaitCollectionList>
  );
}

function AwaitCollectionList(props: {
  children: (collections: CollectionsQuery['collections']) => React.ReactNode;
  error?: React.ReactNode;
  fallback: React.ReactNode;
  sanityData: CollectionListSectionProps;
}) {
  const loaderData = useLoaderData<typeof indexLoader>();
  const collectionListPromise = loaderData?.collectionListPromise;
  const sanityCollectionListGids = props.sanityData.collections
    ?.map((collection) => collection.store.gid)
    .sort()
    .join(',');

  if (!collectionListPromise) {
    console.warn(
      '[CollectionListSection] No collectionListPromise found in loader data.',
    );
    return null;
  }

  return (
    <Suspense fallback={props.fallback}>
      <Await errorElement={props.error} resolve={collectionListPromise}>
        {(data) => {
          // Resolve the collection list data from Shopify with the gids from Sanity
          let collections:
            | NonNullable<CollectionsQuery['collections']>
            | null
            | undefined;

          for (const result of data) {
            if (result.status === 'fulfilled') {
              const {collections: resultCollections} = result.value;
              const shopifyCollectionListGids = resultCollections.nodes
                .map((collection) => collection.id)
                .sort()
                .join(',');
              // Compare the Sanity gids with the Shopify gids
              if (sanityCollectionListGids === shopifyCollectionListGids) {
                collections = resultCollections;
                break;
              }
            } else if (result.status === 'rejected') {
              return props.error;
            }
          }

          return <>{collections && props.children(collections)}</>;
        }}
      </Await>
    </Suspense>
  );
}
