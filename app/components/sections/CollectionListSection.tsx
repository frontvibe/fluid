import type {TypeFromSelection} from 'groqd';
import type {CollectionsQuery} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {COLLECTION_LIST_SECTION_FRAGMENT} from '~/qroq/sections';

import type {loader as indexLoader} from '../../routes/_index';

import {CollectionListGrid} from '../CollectionListGrid';

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
  props: SectionDefaultProps & {data: CollectionListSectionProps},
) {
  // Todo => Add a skeleton
  return (
    <AwaitCollectionList
      fallback={<div className="container">Loading...</div>}
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
  fallback: React.ReactNode;
  sanityData: CollectionListSectionProps;
}) {
  const loaderData = useLoaderData<typeof indexLoader>();
  const collectionListPromise = loaderData?.collectionListPromise;
  const sanityCollectionListGids = props.sanityData.collections
    ?.map((collection) => collection.store.gid)
    .join(',');

  if (!collectionListPromise) {
    console.warn(
      '[CollectionListSection] No collectionListPromise found in loader data.',
    );
  }

  return collectionListPromise ? (
    <Suspense fallback={props.fallback}>
      <Await
        // Todo => Add an error component
        errorElement={<div>Error</div>}
        resolve={collectionListPromise}
      >
        {(data) => {
          // Resolve the collection list data from Shopify with the gids from Sanity
          const collections = data.map((result) => {
            // Check if the promise is fulfilled
            if (result.status === 'fulfilled') {
              const {collections} = result.value;
              const shopifyCollectionListGids = collections.nodes
                .map((collection) => collection.id)
                .join(',');
              // Compare the Sanity gids with the Shopify gids
              return sanityCollectionListGids === shopifyCollectionListGids
                ? collections
                : null;
            }
            // Todo => Return error component if the promise is rejected
            return null;
          })[0];

          return <>{collections && props.children(collections)}</>;
        }}
      </Await>
    </Suspense>
  ) : null;
}
