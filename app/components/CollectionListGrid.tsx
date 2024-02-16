import type {CSSProperties} from 'react';
import type {CollectionsQuery} from 'storefrontapi.generated';

import {flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import {CollectionCard} from './CollectionCard';

export function CollectionListGrid(props: {
  collections?: CollectionsQuery['collections'];
  columns?: null | number;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const collections = props.collections?.nodes.length
    ? flattenConnection(props.collections)
    : [];
  const columnsVar = {
    '--columns': props.columns ?? 3,
  } as CSSProperties;

  return (
    <ul
      className={cx([
        'grid gap-x-[--grid-horizontal-space] gap-y-[--grid-vertical-space]',
        'lg:grid-cols-[repeat(var(--columns),_minmax(0,_1fr))]',
      ])}
      style={columnsVar}
    >
      {!props.skeleton && collections && collections.length > 0
        ? collections.map((collection) => (
            <li key={collection.id}>
              <CollectionCard collection={collection} columns={props.columns} />
            </li>
          ))
        : props.skeleton
          ? [...Array(props.skeleton.cardsNumber ?? 3)].map((_, i) => (
              <li key={i}>
                <CollectionCard
                  columns={props.columns}
                  skeleton={{
                    cardsNumber: props.skeleton?.cardsNumber,
                  }}
                />
              </li>
            ))
          : null}
    </ul>
  );
}
